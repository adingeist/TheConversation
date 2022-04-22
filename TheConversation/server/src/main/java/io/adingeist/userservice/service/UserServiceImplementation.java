package io.adingeist.userservice.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.adingeist.userservice.domain.RecoveryToken;
import io.adingeist.userservice.domain.Role;
import io.adingeist.userservice.domain.User;
import io.adingeist.userservice.email.EmailMessage;
import io.adingeist.userservice.email.SendEmail;
import io.adingeist.userservice.repository.RecoveryTokenRepository;
import io.adingeist.userservice.repository.RoleRepository;
import io.adingeist.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.apache.commons.codec.binary.Base64;

import javax.transaction.Transactional;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

/*
* @Service - tells this is the service layer of the application, responsible for the business logic
* @RequiredArgsConstructor - creates a constructor with all the fields required in it
* @Transactional - modifies database
* @Slf4j - logging
*/

@Service @RequiredArgsConstructor @Transactional @Slf4j
public class UserServiceImplementation implements UserService, UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RecoveryTokenRepository recoveryTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final SendEmail sendEmail;
    private final EmailMessage emailMessage;

    private void validateExistenceOf(User user) {
        if (user == null) {
            log.error("User not found in the database.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found in the database.");
        } else {
            log.info("User found in the database: {}.", user.getUsername());
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        validateExistenceOf(user);
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        });
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }

    @Override
    public User saveUser(User user) {
        log.info("Saving new user {} to the database.", user.getName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Role saveRole(Role role) {
        log.info("Saving new role to {} the database.", role.getName());
        return roleRepository.save(role);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        log.info("Adding role {} to user {}.", roleName, username);
        User user = userRepository.findByUsername(username);
        Role role = roleRepository.findByName(roleName);
        user.getRoles().add(role); // @Transactional - will automatically update this entry in the database
    }

    @Override
    public User getUser(String username) {
        log.info("Fetching user {}.", username);
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> getUsers() {
        log.info("Fetching all users.");
        return userRepository.findAll();
    }

    @Override
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email);
        validateExistenceOf(user);

        Algorithm algorithm = Algorithm.HMAC256("secret".getBytes(StandardCharsets.UTF_8)); // would not keep "secret" like this in production

        String jwt = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 minute expiry
                .sign(algorithm);

        String jwtHash = passwordEncoder.encode(jwt);

        RecoveryToken recoveryToken = new RecoveryToken(
            user.getId(),
            jwtHash,
            LocalDateTime.now().plusMinutes(15)
        );

        recoveryTokenRepository.save(recoveryToken);

        try {
            sendEmail.send(email, emailMessage.buildEmail(jwt));
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error sending email to " + email + ".");
        }

        return "Sent email to " + email + " successfully.";
    }

    @Override
    public String resetPassword(String resetToken, String newPassword) {
        try {
            Algorithm algorithm = Algorithm.HMAC256("secret".getBytes(StandardCharsets.UTF_8));
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(resetToken);
            DecodedJWT decodedJWT = JWT.decode(resetToken);
            String username = decodedJWT.getSubject();

            User user = userRepository.findByUsername(username);

            if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Failed to find user.");

            RecoveryToken recoveryToken = recoveryTokenRepository.findByUserId(user.getId());

            if (recoveryToken == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Failed to find provided token in database.");

            boolean match = passwordEncoder.matches(resetToken, recoveryToken.getSecretHash());

            if (!match) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Token doesn't match one in database.");

            // Set new password
            String encodedNewPassword  = passwordEncoder.encode(newPassword);
            userRepository.updatePassword(encodedNewPassword, user.getId());

        } catch (TokenExpiredException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Token is expired.");
        } catch (JWTVerificationException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Token is invalid.");
        }

        return "Password reset successfully.";
    }
}
