package io.adingeist.userservice.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

import static javax.persistence.GenerationType.AUTO;

/*
* @Entity - compile as a table in the SQL database
* @Data - creates getters and setters methods
* @NoArgsConstructor - creates a constructor with no args
* @AllArgsConstructor - creates a constructor with all the fields
*/
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = AUTO) // automatically create an id in the database for each entry
    private Long id;
    private String name;
    private String email;
    private String username;
    private String password;
    @ManyToMany(fetch = FetchType.EAGER) // we want to load all the roles whenever we load a user
    private Collection<Role> roles = new ArrayList<>();
}
