package com.doan.repositories;

import com.doan.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    Document findByTitle(String title);

    List<Document> findByIsNew(boolean isNew);
}
