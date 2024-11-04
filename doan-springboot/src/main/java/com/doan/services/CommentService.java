package com.doan.services;

import com.doan.entities.Comment;
import com.doan.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getCommentsByDocumentId(Long documentId) {
        return commentRepository.findByDocumentId(documentId);
    }

    public List<Comment> getCommentsByCourseId(Long courseId) {
        return commentRepository.findByCourseId(courseId);
    }

    public List<Comment> getCommentsBySoftwareId(Long softwareId) {
        return commentRepository.findBySoftwareId(softwareId);
    }

    public List<Comment> getCommentsByUserId(Long userId) {
        return commentRepository.findByUserId(userId);
    }

    public Comment addComment(Comment comment) {
        comment.setTimestamp(LocalDateTime.now()); // Set thời gian hiện tại khi thêm mới comment
        return commentRepository.save(comment);
    }

    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
