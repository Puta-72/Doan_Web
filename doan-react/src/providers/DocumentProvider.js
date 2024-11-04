import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchDocuments, 
  getDocumentDetail, 
  downloadDocument, 
  createDocument,
  uploadDocumentImage, 
  editDocument, 
  deleteDocument, 
  fetchCommentsByDocumentId, 
  fetchRatingsByDocumentId, 
  addComment, 
  addOrUpdateRating,
  uploadDocumentFile,
  authHeader 
} from '../api';
import { useAuth } from './AuthProvider';

const DocumentContext = createContext();

export const useDocuments = () => useContext(DocumentContext);

const DocumentProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  // useEffect(() => {
  //   const loadDocuments = async () => {
  //     try {
  //       let response;
  //       if (isAuthenticated) {
  //         response = await fetchDocuments();
  //       } else {
  //         response = await fetchNewDocuments();
  //       }
  //       setDocuments(response.data);
  //     } catch (error) {
  //       console.error('Error fetching documents:', error);
  //     }
  //   };
  //   loadDocuments();
  // }, [isAuthenticated]);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await fetchDocuments();
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    loadDocuments();
  }, []);

  // chi tiết tài liệu
  const getDocumentDetails = async (documentId) => {
    try {
      const response = await getDocumentDetail(documentId);
      setSelectedDocument(response.data);
      await loadComments(documentId);
      await loadRatings(documentId);
    } catch (error) {
      console.error('Error fetching document details:', error);
    }
  };

  // tải tài liệu
  const download = async (documentId) => {
    try {
      const response = await downloadDocument(documentId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document_${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  // tạo tài liệu (admin)
  const createNewDocument = async (documentData) => {
    try {
      const response = await createDocument(documentData);
      setDocuments((prevDocuments) => [...prevDocuments, response.data]);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  // cập nhật tài liệu (admin)
  const updateDocument = async (documentId, updatedData) => {
    try {
      const response = await editDocument(documentId, updatedData);
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) => (doc.id === documentId ? { ...doc, ...response.data } : doc))
      );
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  // xóa tài liệu (admin)
  const deleteDocumentById = async (documentId) => {
    try {
      await deleteDocument(documentId);
      setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Tải các bình luận cho tài liệu
  const loadComments = async (documentId) => {
    try {
      const response = await fetchCommentsByDocumentId(documentId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Thêm bình luận
  const handleAddComment = async (commentData) => {
    try {
      const response = await addComment(commentData);
      setComments((prevComments) => [...prevComments, response.data]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Tải các đánh giá cho tài liệu
  const loadRatings = async (documentId) => {
    try {
      const response = await fetchRatingsByDocumentId(documentId);
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // Thêm hoặc cập nhật đánh giá
  const handleAddOrUpdateRating = async (ratingData) => {
    try {
      const response = await addOrUpdateRating(ratingData);
      setRatings((prevRatings) => {
        const existingRatingIndex = prevRatings.findIndex(
          (rating) => rating.user.id === ratingData.user.id && rating.document.id === ratingData.document.id
        );
        if (existingRatingIndex !== -1) {
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

  const uploadFile = async (documentId, file) => {
    try {
        const response = await uploadDocumentFile(documentId, file, {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        setDocuments((prevDocuments) =>
            prevDocuments.map((doc) => (doc.id === documentId ? { ...doc, ...response.data } : doc))
        );
    } catch (error) {
        console.error('Lỗi khi tải lên file:', error);
    }
};


  // tải tài liệu
  const downloadDocumentFile = async (documentId) => {
  try {
    const response = await downloadDocument(documentId);
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document_${documentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading document:', error);
  }
};

  return (
    <DocumentContext.Provider value={{
      documents,
      selectedDocument,
      comments,
      ratings,
      getDocumentDetails,
      uploadFile,
      setSelectedDocument,
      downloadDocumentFile,
      createNewDocument,
      updateDocument,
      deleteDocumentById,
      handleAddComment,
      handleAddOrUpdateRating
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentProvider;
