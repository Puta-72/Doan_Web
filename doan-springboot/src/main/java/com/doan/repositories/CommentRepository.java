package com.doan.repositories;

import com.doan.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByDocumentId(Long documentId);
    List<Comment> findByCourseId(Long courseId);
    List<Comment> findBySoftwareId(Long softwareId);
    List<Comment> findByUserId(Long userId);
}
