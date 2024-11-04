package com.doan.controllers;

import com.doan.entities.Software;
import com.doan.services.SoftwareService;
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
@RequestMapping("/api/software")
public class SoftwareController {

    @Autowired
    private SoftwareService softwareService;

    // Lấy tất cả phần mềm
    @GetMapping
    public ResponseEntity<List<Software>> getSoftware() {
        List<Software> softwareList = softwareService.getAllSoftware();
        return ResponseEntity.status(HttpStatus.OK).body(softwareList);
    }

    // Lấy phần mềm mới
    @GetMapping("/new")
    public ResponseEntity<List<Software>> getNewSoftware() {
        List<Software> newSoftware = softwareService.getNewSoftware();
        return ResponseEntity.status(HttpStatus.OK).body(newSoftware);
    }

    // Chi tiết phần mềm
    @GetMapping("/{id}")
    public ResponseEntity<Software> getSoftwareDetail(@PathVariable Long id) {
        return softwareService.getSoftwareById(id)
                .map(software -> ResponseEntity.status(HttpStatus.OK).body(software))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Tạo phần mềm mới (chỉ admin)
    @PostMapping
    public ResponseEntity<Software> createSoftware(@RequestBody Software software) {
        Software savedSoftware = softwareService.createSoftware(software);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSoftware);
    }

    // Chỉnh sửa phần mềm (chỉ admin)
    @PutMapping("/{id}")
    public ResponseEntity<Software> editSoftware(@PathVariable Long id, @RequestBody Software updatedSoftware) {
        try {
            Software savedSoftware = softwareService.updateSoftware(id, updatedSoftware);
            return ResponseEntity.status(HttpStatus.OK).body(savedSoftware);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Upload hình ảnh cho phần mềm
    @PostMapping("/{id}/upload")
    public ResponseEntity<Software> uploadSoftwareImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Software updatedSoftware = softwareService.saveSoftwareImage(id, file);
            return ResponseEntity.status(HttpStatus.OK).body(updatedSoftware);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Upload file (PDF hoặc các loại file khác)
    @PostMapping("/{id}/upload-file")
    public ResponseEntity<Software> uploadSoftwareFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Software updatedSoftware = softwareService.saveSoftwareFile(id, file);
            return ResponseEntity.status(HttpStatus.OK).body(updatedSoftware);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Endpoint để tải xuống file từ cơ sở dữ liệu
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadSoftware(@PathVariable Long id) {
        Optional<Software> softwareOptional = softwareService.getSoftwareById(id);
        if (softwareOptional.isPresent()) {
            Software software = softwareOptional.get();
            byte[] fileData = software.getFileData(); // Giả sử `fileData` chứa dữ liệu file

            if (fileData != null && fileData.length > 0) {
                ByteArrayResource resource = new ByteArrayResource(fileData);

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + software.getTitle() + ".pdf\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Xóa phần mềm (chỉ admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSoftware(@PathVariable Long id) {
        boolean isDeleted = softwareService.deleteSoftware(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Software deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Software not found");
        }
    }
}
