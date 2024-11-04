package com.doan.repositories;

import com.doan.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    CartItem findByCourseTitleAndBuyer(String courseTitle, String buyer);
    List<CartItem> findByCourseTitle(String courseTitle);
}
