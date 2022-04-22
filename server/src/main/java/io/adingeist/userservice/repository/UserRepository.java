package io.adingeist.userservice.repository;

import io.adingeist.userservice.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

// Interacts with the User table with id type as Long
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring is intelligent and will interpret this as the SQL command:
    //    "SELECT user FROM User WHERE username = username"
    User findByUsername(String username);

    User findByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.password = ?1 WHERE u.id = ?2")
    void updatePassword(String encodedNewPassword, Long userId);
}
