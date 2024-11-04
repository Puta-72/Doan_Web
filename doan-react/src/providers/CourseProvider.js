import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchCourses, 
  getCourseDetail, 
  createCourse, 
  editCourse, 
  deleteCourse, 
  fetchCommentsByCourseId, 
  fetchRatingsByCourseId, 
  addComment, 
  addOrUpdateRating 
} from '../api';
import { useAuth } from './AuthProvider';

const CourseContext = createContext();

export const useCourses = () => useContext(CourseContext);

const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    loadCourses();
  }, []);

  const getCourseDetails = async (courseId) => {
    try {
      const response = await getCourseDetail(courseId);
      setSelectedCourse(response.data);
      await loadComments(courseId);
      await loadRatings(courseId);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  // Tải các bình luận cho khóa học
  const loadComments = async (courseId) => {
    try {
      const response = await fetchCommentsByCourseId(courseId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Thêm bình luận
  const handleAddComment = async (commentData) => {
    try {
      const response = await addComment(commentData);
      setComments(prevComments => [...prevComments, response.data]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Tải các đánh giá cho khóa học
  const loadRatings = async (courseId) => {
    try {
      const response = await fetchRatingsByCourseId(courseId);
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // Thêm hoặc cập nhật đánh giá
  const handleAddOrUpdateRating = async (ratingData) => {
    try {
      const response = await addOrUpdateRating(ratingData);
      setRatings(prevRatings => {
        const existingRatingIndex = prevRatings.findIndex(
          rating => rating.user.id === ratingData.user.id && rating.course.id === ratingData.course.id
        );
        if (existingRatingIndex !== -1) {
          // Cập nhật đánh giá nếu đã tồn tại
          const updatedRatings = [...prevRatings];
          updatedRatings[existingRatingIndex] = response.data;
          return updatedRatings;
        }
        // Thêm đánh giá mới
        return [...prevRatings, response.data];
      });
    } catch (error) {
      console.error('Error adding or updating rating:', error);
    }
  };

  const createNewCourse = async (courseData) => {
    try {
      const response = await createCourse(courseData);
      setCourses(prevCourses => [...prevCourses, response.data]);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const updateCourse = async (courseId, updatedData) => {
    try {
      const response = await editCourse(courseId, updatedData);
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId ? { ...course, ...response.data } : course
        )
      );
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const deleteCourseById = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <CourseContext.Provider value={{ 
      courses, 
      selectedCourse, 
      comments, 
      ratings, 
      getCourseDetails, 
      handleAddComment, 
      handleAddOrUpdateRating, 
      createNewCourse, 
      updateCourse, 
      deleteCourseById 
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export default CourseProvider;
