package com.doan.controllers;

import com.doan.entities.Rating;
import com.doan.entities.User;
import com.doan.entities.Document;
import com.doan.entities.Software;
import com.doan.entities.Course;
import com.doan.services.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<Rating>> getRatingsByDocumentId(@PathVariable Long documentId) {
        List<Rating> ratings = ratingService.getRatingsByDocumentId(documentId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Rating>> getRatingsByCourseId(@PathVariable Long courseId) {
        List<Rating> ratings = ratingService.getRatingsByCourseId(courseId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/software/{softwareId}")
    public ResponseEntity<List<Rating>> getRatingsBySoftwareId(@PathVariable Long softwareId) {
        List<Rating> ratings = ratingService.getRatingsBySoftwareId(softwareId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getRatingsByUserId(@PathVariable Long userId) {
        List<Rating> ratings = ratingService.getRatingsByUserId(userId);
        return ResponseEntity.ok(ratings);
    }

    @PostMapping
    public ResponseEntity<Rating> addRating(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Double ratingValue = Double.valueOf(payload.get("ratingValue").toString());

        Rating rating = new Rating();
        rating.setRatingValue(ratingValue);

        User user = new User();
        user.setId(userId);
        rating.setUser(user);

        if (payload.containsKey("documentId")) {
            Long documentId = Long.valueOf(payload.get("documentId").toString());
            Document document = new Document();
            document.setId(documentId);
            rating.setDocument(document);
        }

        if (payload.containsKey("courseId")) {
            Long courseId = Long.valueOf(payload.get("courseId").toString());
            Course course = new Course();
            course.setId(courseId);
            rating.setCourse(course);
        }

        if (payload.containsKey("softwareId")) {
            Long softwareId = Long.valueOf(payload.get("softwareId").toString());
            Software software = new Software();
            software.setId(softwareId);
            rating.setSoftware(software);
        }

        Rating savedRating = ratingService.addOrUpdateRating(rating);
        return ResponseEntity.ok(savedRating);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
        return ResponseEntity.noContent().build();
    }
}
