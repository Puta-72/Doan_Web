package com.doan.controllers;

import com.doan.entities.Course;
import com.doan.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // list tất cả course
    @GetMapping
    public ResponseEntity<List<Course>> getCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.status(HttpStatus.OK).body(courses);
    }

    // lấy khóa học mới
    @GetMapping("/new")
    public ResponseEntity<List<Course>> getNewDocuments() {
        List<Course> newCourses = courseService.getNewCourses();
        return ResponseEntity.status(HttpStatus.OK).body(newCourses);
    }

    // detail course
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseDetail(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> ResponseEntity.status(HttpStatus.OK).body(course))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Tạo khóa học mới (chỉ admin)
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course savedCourse = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    }

    // Chỉnh sửa khóa học (chỉ admin)
    @PutMapping("/{id}")
    public ResponseEntity<Course> editCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        try {
            Course savedCourse = courseService.updateCourse(id, updatedCourse);
            return ResponseEntity.status(HttpStatus.OK).body(savedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Xóa khóa học (chỉ admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        boolean isDeleted = courseService.deleteCourse(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Course deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
        }
    }
}
