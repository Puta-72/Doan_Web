package com.doan.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "document")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private boolean isNew;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    @Transient
    private String base64Image;

    @Lob
    @Column(name = "file_data", columnDefinition = "LONGBLOB")
    private byte[] fileData;

    @Lob
    @Column(name = "download_link", columnDefinition = "LONGBLOB")
    private byte[] downloadLink;

    public Document() {}

    public Document(String title, boolean isNew, byte[] image, byte[] fileData, byte[] downloadLink) {
        this.title = title;
        this.isNew = isNew;
        this.image = image;
        this.fileData = fileData;
        this.downloadLink = downloadLink;
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isNew() {
        return isNew;
    }

    public void setNew(boolean aNew) {
        isNew = aNew;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getBase64Image() {
        return base64Image;
    }

    public void setBase64Image(String base64Image) {
        this.base64Image = base64Image;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public void setFileData(byte[] fileData) {
        this.fileData = fileData;
    }

    public byte[] getDownloadLink() {
        return downloadLink;
    }

    public void setDownloadLink(byte[] downloadLink) {
        this.downloadLink = downloadLink;
    }
}
