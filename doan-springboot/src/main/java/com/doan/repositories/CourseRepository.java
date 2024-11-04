package com.doan.repositories;

import com.doan.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findByTitle(String title);

    List<Course> findByIsNew(boolean isNew);
}
