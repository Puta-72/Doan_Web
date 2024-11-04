package com.doan.repositories;

import com.doan.entities.Software;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SoftwareRepository extends JpaRepository<Software, Long> {
    Software findByTitle(String title);

    List<Software> findByIsNew(boolean isNew);

}
