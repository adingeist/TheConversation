package io.adingeist.userservice.api;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.adingeist.userservice.domain.Post;
import io.adingeist.userservice.domain.Role;
import io.adingeist.userservice.domain.User;
import io.adingeist.userservice.requests.ForgotPasswordRequest;
import io.adingeist.userservice.requests.PostPostRequest;
import io.adingeist.userservice.requests.ResetPasswordRequest;
import io.adingeist.userservice.service.PostService;
import io.adingeist.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final UserService userService;

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getPosts() {
        return ResponseEntity.ok().body(postService.getPosts());
    }

    @PostMapping("/post")
    public ResponseEntity<Post> postPost(@RequestHeader(name = "Authorization") String authHeader, @RequestBody PostPostRequest request) {
        String token = authHeader.substring("Bearer ".length()); // Remove "Bearer " from the token
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/post").toUriString());

        DecodedJWT decodedJWT = JWT.decode(token);
        String username = decodedJWT.getSubject();
        User user = userService.getUser(username);
        if (user == null) throw new ResponseStatusException(NOT_FOUND, "Couldn't find user.");

        Post post = new Post(user, request.getMessage());

        return ResponseEntity.created(uri).body(postService.postPost(post)); // Return HTTP 201 "created" if successful
    }
}

