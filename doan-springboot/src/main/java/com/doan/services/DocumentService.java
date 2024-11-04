package com.doan.services;

import com.doan.entities.Document;
import com.doan.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    // Lấy danh sách tất cả tài liệu
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    // Chi tiết một tài liệu theo ID
    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    // Lấy danh sách tài liệu mới
    public List<Document> getNewDocuments() {
        return documentRepository.findByIsNew(true);
    }

    // Tạo tài liệu (admin)
    public Document createDocument(Document document) {
        return documentRepository.save(document);
    }

    // Cập nhật thông tin tài liệu (admin)
    public Document updateDocument(Long id, Document updatedDocument) {
        return documentRepository.findById(id)
                .map(existingDocument -> {
                    existingDocument.setTitle(updatedDocument.getTitle());
                    existingDocument.setNew(updatedDocument.isNew());
                    existingDocument.setImage(updatedDocument.getImage());
                    existingDocument.setDownloadLink(updatedDocument.getDownloadLink());
                    return documentRepository.save(existingDocument);
                })
                .orElseThrow(() -> new RuntimeException("Document not found with id " + id));
    }

    //Upload hình ảnh
    public Document saveDocumentImage(Long id, MultipartFile file) throws IOException {
        return documentRepository.findById(id).map(document -> {
            try {
                document.setImage(file.getBytes());
                document.setBase64Image("data:image/jpeg;base64," + Base64.getEncoder().encodeToString(file.getBytes()));
                return documentRepository.save(document);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        }).orElseThrow(() -> new RuntimeException("Document not found with id " + id));
    }

    // Upload file (PDF hoặc các loại file khác)
    public Document saveDocumentFile(Long id, MultipartFile file) throws IOException {
        return documentRepository.findById(id).map(document -> {
            try {
                document.setFileData(file.getBytes());
                document.setDownloadLink(("data:application/pdf;base64," + Base64.getEncoder().encodeToString(file.getBytes())).getBytes());
                return documentRepository.save(document);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save file", e);
            }
        }).orElseThrow(() -> new RuntimeException("Document not found with id " + id));
    }

    // Xóa tài liệu (admin)
    public boolean deleteDocument(Long id) {
        if (documentRepository.existsById(id)) {
            documentRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
