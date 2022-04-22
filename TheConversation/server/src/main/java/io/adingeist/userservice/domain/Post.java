package io.adingeist.userservice.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

import static javax.persistence.GenerationType.AUTO;

/*
* @Entity - compile as a table in the SQL database
* @Data - creates getters and setters methods
* @NoArgsConstructor - creates a constructor with no args
* @AllArgsConstructor - creates a constructor with all the fields
*/
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class Post {
    @Id @GeneratedValue(strategy = AUTO) // automatically create an id in the database for each entry
    private Long id;
    @OneToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    private String message;
    private LocalDateTime createdAt;

    public Post(User user, String message) {
        this.user = user;
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }
}
