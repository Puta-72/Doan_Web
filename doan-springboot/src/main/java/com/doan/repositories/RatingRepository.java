package com.doan.repositories;

import com.doan.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByDocumentId(Long documentId);
    List<Rating> findByCourseId(Long courseId);
    List<Rating> findBySoftwareId(Long softwareId);
    List<Rating> findByUserId(Long userId);
    Optional<Rating> findByUserIdAndDocumentId(Long userId, Long documentId);
    Optional<Rating> findByUserIdAndCourseId(Long userId, Long courseId);
    Optional<Rating> findByUserIdAndSoftwareId(Long userId, Long softwareId);
}
