package com.doan.controllers;

import com.doan.entities.Document;
import com.doan.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // Lấy tất cả tài liệu
    @GetMapping
    public ResponseEntity<List<Document>> getDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.status(HttpStatus.OK).body(documents);
    }

    // Lấy tài liệu mới
    @GetMapping("/new")
    public ResponseEntity<List<Document>> getNewDocuments() {
        List<Document> newDocuments = documentService.getNewDocuments();
        return ResponseEntity.status(HttpStatus.OK).body(newDocuments);
    }

    // Chi tiết tài liệu
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentDetail(@PathVariable Long id) {
        return documentService.getDocumentById(id)
                .map(document -> ResponseEntity.status(HttpStatus.OK).body(document))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Tạo tài liệu mới (chỉ admin)
    @PostMapping
    public ResponseEntity<Document> createDocument(@RequestBody Document document) {
        Document savedDocument = documentService.createDocument(document);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDocument);
    }

    // Chỉnh sửa tài liệu (chỉ admin)
    @PutMapping("/{id}")
    public ResponseEntity<Document> editDocument(@PathVariable Long id, @RequestBody Document updatedDocument) {
        try {
            Document savedDocument = documentService.updateDocument(id, updatedDocument);
            return ResponseEntity.status(HttpStatus.OK).body(savedDocument);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Upload hình ảnh cho tài liệu
    @PostMapping("/{id}/upload")
    public ResponseEntity<Document> uploadDocumentImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Document updatedDocument = documentService.saveDocumentImage(id, file);
            return ResponseEntity.status(HttpStatus.OK).body(updatedDocument);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Upload file (PDF hoặc các loại file khác)
    @PostMapping("/{id}/upload-file")
    public ResponseEntity<Document> uploadDocumentFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Document updatedDocument = documentService.saveDocumentFile(id, file);
            return ResponseEntity.status(HttpStatus.OK).body(updatedDocument);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Endpoint để tải xuống file từ cơ sở dữ liệu
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Optional<Document> documentOptional = documentService.getDocumentById(id);
        if (documentOptional.isPresent()) {
            Document document = documentOptional.get();
            byte[] fileData = document.getFileData(); // Giả sử `fileData` chứa dữ liệu file

            if (fileData != null) {
                ByteArrayResource resource = new ByteArrayResource(fileData);

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getTitle() + ".pdf\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Xóa tài liệu (chỉ admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id) {
        boolean isDeleted = documentService.deleteDocument(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Document deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found");
        }
    }
}
