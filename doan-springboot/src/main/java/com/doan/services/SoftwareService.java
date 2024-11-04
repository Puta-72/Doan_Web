package com.doan.services;

import com.doan.entities.Software;
import com.doan.repositories.SoftwareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class SoftwareService {

    @Autowired
    private SoftwareRepository softwareRepository;

    public List<Software> getAllSoftware() {
        return softwareRepository.findAll();
    }

    public Optional<Software> getSoftwareById(Long id) {
        return softwareRepository.findById(id);
    }

    public List<Software> getNewSoftware() {
        return softwareRepository.findByIsNew(true);
    }

    public Software createSoftware(Software software) {
        return softwareRepository.save(software);
    }

    public Software updateSoftware(Long id, Software updatedSoftware) {
        return softwareRepository.findById(id)
                .map(existingSoftware -> {
                    existingSoftware.setTitle(updatedSoftware.getTitle());
                    existingSoftware.setNew(updatedSoftware.isNew());
                    existingSoftware.setImage(updatedSoftware.getImage());
                    existingSoftware.setDownloadLink(updatedSoftware.getDownloadLink());
                    return softwareRepository.save(existingSoftware);
                })
                .orElseThrow(() -> new RuntimeException("Software not found with id " + id));
    }

    // Upload hình ảnh
    public Software saveSoftwareImage(Long id, MultipartFile file) throws IOException {
        return softwareRepository.findById(id).map(software -> {
            try {
                software.setImage(file.getBytes());
                software.setBase64Image("data:image/jpeg;base64," + Base64.getEncoder().encodeToString(file.getBytes()));
                return softwareRepository.save(software);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image", e);
            }
        }).orElseThrow(() -> new RuntimeException("Software not found with id " + id));
    }

    // Upload file (PDF hoặc các loại file khác)
    public Software saveSoftwareFile(Long id, MultipartFile file) throws IOException {
        return softwareRepository.findById(id).map(software -> {
            try {
                software.setFileData(file.getBytes());
                software.setDownloadLink(("data:application/pdf;base64," + Base64.getEncoder().encodeToString(file.getBytes())).getBytes());
                return softwareRepository.save(software);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save file", e);
            }
        }).orElseThrow(() -> new RuntimeException("Software not found with id " + id));
    }

    public boolean deleteSoftware(Long id) {
        if (softwareRepository.existsById(id)) {
            softwareRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
