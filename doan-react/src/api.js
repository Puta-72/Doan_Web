import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthToken = () => localStorage.getItem('authToken');

const authHeader = () => {
    const token = getAuthToken();
    if (token) {
        return { headers: { Authorization: `Bearer ${token}` } };
    } else {
        return {};
    }
};

// Đăng ký và đăng nhập người dùng
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response;
};

export const loginUser = (username, password) => {
    return axios.post(`${API_URL}/auth/login`, { username, password });
};

export const logoutUser = () => {
    return axios.post(`${API_URL}/auth/logout`, {}, authHeader());
};

export const getUserByUsername = (username) => {
    return axios.get(`${API_URL}/users/by-username/${username}`, authHeader());
};

export const getCurrentUser = () => {
    return axios.get(`${API_URL}/users/me`, authHeader());
};

export const updateProfile = (userId, updatedData) => {
    return axios.put(`${API_URL}/users/${userId}`, updatedData, authHeader());
};

// Tài liệu (Documents)
export const fetchDocuments = () => {
    return axios.get(`${API_URL}/documents`);
};

export const getDocumentDetail = (documentId) => {
    return axios.get(`${API_URL}/documents/${documentId}`);
};

export const fetchNewDocuments = () => {
    return axios.get(`${API_URL}/documents/new`);
};

export const downloadDocument = (documentId) => {
    return axios.get(`${API_URL}/documents/download/${documentId}`, {
      responseType: 'blob',
      ...authHeader(),
    });
  };

// Tài liệu (Documents)
export const createDocument = (documentData) => {
    return axios.post(`${API_URL}/documents`, documentData); // Không cần gửi headers xác thực
};

export const editDocument = (documentId, updatedData) => {
    return axios.put(`${API_URL}/documents/${documentId}`, updatedData); // Không cần gửi headers xác thực
};

export const uploadDocumentImage = (documentId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_URL}/documents/${documentId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const uploadDocumentFile = (documentId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_URL}/documents/${documentId}/upload-file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteDocument = (documentId) => {
    return axios.delete(`${API_URL}/documents/${documentId}`, authHeader());
};


// Khóa học (Courses)
export const fetchCourses = () => {
    return axios.get(`${API_URL}/courses`, authHeader());
};

export const getCourseDetail = (courseId) => {
    return axios.get(`${API_URL}/courses/${courseId}`, authHeader());
};

export const createCourse = (courseData) => {
    return axios.post(`${API_URL}/courses`, courseData, authHeader());
};

export const editCourse = (courseId, updatedData) => {
    return axios.put(`${API_URL}/courses/${courseId}`, updatedData, authHeader());
};

export const deleteCourse = (courseId) => {
    return axios.delete(`${API_URL}/courses/${courseId}`, authHeader());
};

// Phần mềm (Software)
export const fetchSoftware = () => {
    return axios.get(`${API_URL}/software`, authHeader());
};

export const getSoftwareDetail = (softwareId) => {
    return axios.get(`${API_URL}/software/${softwareId}`, authHeader());
};

export const fetchNewSoftware = () => {
    return axios.get(`${API_URL}/software/new`);
};

export const downloadSoftware = (softwareId) => {
    return axios.get(`${API_URL}/software/${softwareId}/download`, {
        responseType: 'blob',
        ...authHeader(),
    });
};

export const createSoftware = (softwareData) => {
    return axios.post(`${API_URL}/software`, softwareData, authHeader());
};

export const editSoftware = (softwareId, updatedData) => {
    return axios.put(`${API_URL}/software/${softwareId}`, updatedData, authHeader());
};

export const deleteSoftware = (softwareId) => {
    return axios.delete(`${API_URL}/software/${softwareId}`, authHeader());
};

// Phần mềm (Software)
export const uploadSoftwareImage = (softwareId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_URL}/software/${softwareId}/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...authHeader(),
        },
    });
};

export const uploadSoftwareFile = (softwareId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_URL}/software/${softwareId}/upload-file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...authHeader(),
        },
    });
};

// Giỏ hàng (Cart)
export const fetchCart = () => {
    return axios.get(`${API_URL}/cart`, authHeader());
};

export const addToCart = (payload) => {
    return axios.post(`${API_URL}/cart`, payload, authHeader());
};

export const removeFromCart = (courseId) => {
    return axios.delete(`${API_URL}/cart/${courseId}`, authHeader());
};

export const checkoutCart = () => {
    return axios.post(`${API_URL}/cart/checkout`, {}, authHeader());
};

// Quản lý người dùng (Admin)
export const fetchUsers = () => {
    return axios.get(`${API_URL}/users`, authHeader());
};

export const createUser = (fullName, email, username, password, role) => {
    return axios.post(`${API_URL}/users`, { fullName, email, username, password, role }, authHeader());
};

export const editUser = (userId, updatedData) => {
    return axios.put(`${API_URL}/users/${userId}`, updatedData, authHeader());
};

export const deleteUser = (userId) => {
    return axios.delete(`${API_URL}/users/${userId}`, authHeader());
};

// Comment
export const fetchCommentsByDocumentId = (documentId) => {
    return axios.get(`${API_URL}/comments/document/${documentId}`);
};

export const fetchCommentsByCourseId = (courseId) => {
    return axios.get(`${API_URL}/comments/course/${courseId}`);
};

export const fetchCommentsBySoftwareId = (softwareId) => {
    return axios.get(`${API_URL}/comments/software/${softwareId}`);
};

export const addComment = (commentData) => {
    return axios.post(`${API_URL}/comments`, commentData, authHeader());
};

export const deleteComment = (commentId) => {
    return axios.delete(`${API_URL}/comments/${commentId}`, authHeader());
};

// Rating
export const fetchRatingsByDocumentId = (documentId) => {
    return axios.get(`${API_URL}/ratings/document/${documentId}`);
};

export const fetchRatingsByCourseId = (courseId) => {
    return axios.get(`${API_URL}/ratings/course/${courseId}`);
};

export const fetchRatingsBySoftwareId = (softwareId) => {
    return axios.get(`${API_URL}/ratings/software/${softwareId}`);
};

export const addOrUpdateRating = (ratingData) => {
    return axios.post(`${API_URL}/ratings`, ratingData, authHeader());
};

export const deleteRating = (ratingId) => {
    return axios.delete(`${API_URL}/ratings/${ratingId}`, authHeader());
};

export { authHeader };
