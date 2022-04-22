package io.adingeist.userservice.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecoveryToken {
    @Id
    @GeneratedValue(strategy = AUTO) // automatically create an id in the database for each entry
    private Long id;

    private Long userId;
    private String secretHash;
    private LocalDateTime expiresAt;

    public RecoveryToken(Long userId, String secretHash, LocalDateTime expiresAt) {
        this.userId = userId;
        this.secretHash = secretHash;
        this.expiresAt = expiresAt;
    }
}
