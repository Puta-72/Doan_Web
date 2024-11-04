package com.doan.services;

import com.doan.entities.Rating;
import com.doan.repositories.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    public List<Rating> getRatingsByDocumentId(Long documentId) {
        return ratingRepository.findByDocumentId(documentId);
    }

    public List<Rating> getRatingsByCourseId(Long courseId) {
        return ratingRepository.findByCourseId(courseId);
    }

    public List<Rating> getRatingsBySoftwareId(Long softwareId) {
        return ratingRepository.findBySoftwareId(softwareId);
    }

    public List<Rating> getRatingsByUserId(Long userId) {
        return ratingRepository.findByUserId(userId);
    }

    public Optional<Rating> getRatingByUserIdAndDocumentId(Long userId, Long documentId) {
        return ratingRepository.findByUserIdAndDocumentId(userId, documentId);
    }

    public Optional<Rating> getRatingByUserIdAndCourseId(Long userId, Long courseId) {
        return ratingRepository.findByUserIdAndCourseId(userId, courseId);
    }

    public Optional<Rating> getRatingByUserIdAndSoftwareId(Long userId, Long softwareId) {
        return ratingRepository.findByUserIdAndSoftwareId(userId, softwareId);
    }

    public Rating addOrUpdateRating(Rating rating) {
        rating.setTimestamp(LocalDateTime.now()); // Set thời gian hiện tại khi thêm/cập nhật rating
        return ratingRepository.save(rating);
    }

    public Optional<Rating> getRatingById(Long id) {
        return ratingRepository.findById(id);
    }

    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }
}
