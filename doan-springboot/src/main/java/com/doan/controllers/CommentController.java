package com.doan.controllers;

import com.doan.entities.Comment;
import com.doan.entities.User;
import com.doan.entities.Document;
import com.doan.entities.Software;
import com.doan.entities.Course;
import com.doan.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<Comment>> getCommentsByDocumentId(@PathVariable Long documentId) {
        List<Comment> comments = commentService.getCommentsByDocumentId(documentId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Comment>> getCommentsByCourseId(@PathVariable Long courseId) {
        List<Comment> comments = commentService.getCommentsByCourseId(courseId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/software/{softwareId}")
    public ResponseEntity<List<Comment>> getCommentsBySoftwareId(@PathVariable Long softwareId) {
        List<Comment> comments = commentService.getCommentsBySoftwareId(softwareId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Comment>> getCommentsByUserId(@PathVariable Long userId) {
        List<Comment> comments = commentService.getCommentsByUserId(userId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String content = payload.get("content").toString();

        Comment comment = new Comment();
        comment.setContent(content);

        User user = new User();
        user.setId(userId);
        comment.setUser(user);

        if (payload.containsKey("documentId")) {
            Long documentId = Long.valueOf(payload.get("documentId").toString());
            Document document = new Document();
            document.setId(documentId);
            comment.setDocument(document);
        }

        if (payload.containsKey("courseId")) {
            Long courseId = Long.valueOf(payload.get("courseId").toString());
            Course course = new Course();
            course.setId(courseId);
            comment.setCourse(course);
        }

        if (payload.containsKey("softwareId")) {
            Long softwareId = Long.valueOf(payload.get("softwareId").toString());
            Software software = new Software();
            software.setId(softwareId);
            comment.setSoftware(software);
        }

        Comment savedComment = commentService.addComment(comment);
        return ResponseEntity.ok(savedComment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
