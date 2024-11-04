package com.doan.services;

import com.doan.entities.Course;
import com.doan.entities.Document;
import com.doan.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // tất cả khóa học
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Lấy thông tin khóa học (id)
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public List<Course> getNewCourses() {
        return courseRepository.findByIsNew(true);
    }

    // tạo khóa học mới
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    // Cập nhật thông tin
    public Course updateCourse(Long id, Course updatedCourse) {
        return courseRepository.findById(id)
                .map(existingCourse -> {
                    existingCourse.setTitle(updatedCourse.getTitle());
                    existingCourse.setImage(updatedCourse.getImage());
                    existingCourse.setNew(updatedCourse.isNew());
                    existingCourse.setPrice(updatedCourse.getPrice());
                    return courseRepository.save(existingCourse);
                })
                .orElseThrow(() -> new RuntimeException("Course not found with id " + id));
    }

    // Xóa khóa học
    public boolean deleteCourse(Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
