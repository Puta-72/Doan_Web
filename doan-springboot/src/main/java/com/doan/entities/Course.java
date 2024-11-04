package com.doan.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private boolean isNew;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;
    private Double price;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<CartItem> cartItems;

    public Course() {
    }

    public Course(String title, boolean isNew, byte[] image, Double price, String review, Float rating) {
        this.title = title;
        this.isNew = isNew;
        this.image = image;
        this.price = price;
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
