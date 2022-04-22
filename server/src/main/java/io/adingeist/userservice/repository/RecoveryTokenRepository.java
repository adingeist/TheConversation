package io.adingeist.userservice.repository;

import io.adingeist.userservice.domain.RecoveryToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RecoveryTokenRepository extends JpaRepository<RecoveryToken, Long> {

    RecoveryToken findByUserId(Long id);
}
