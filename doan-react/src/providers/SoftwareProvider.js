import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchSoftware, 
  fetchNewSoftware, 
  getSoftwareDetail, 
  downloadSoftware, 
  createSoftware, 
  editSoftware, 
  deleteSoftware, 
  fetchCommentsBySoftwareId, 
  fetchRatingsBySoftwareId, 
  addComment, 
  addOrUpdateRating,
  uploadSoftwareImage,
  uploadSoftwareFile
} from '../api';
import { useAuth } from './AuthProvider';

const SoftwareContext = createContext();

export const useSoftwares = () => useContext(SoftwareContext);

const SoftwareProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [softwares, setSoftwares] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const loadSoftwares = async () => {
      try {
        let response;
        if (isAuthenticated) {
          response = await fetchSoftware();
        } else {
          response = await fetchNewSoftware();
        }
        setSoftwares(response.data);
      } catch (error) {
        console.error('Error fetching software:', error);
      }
    };
    loadSoftwares();
  }, [isAuthenticated]);

  // software details
  const getSoftwareDetails = async (softwareId) => {
    try {
      const response = await getSoftwareDetail(softwareId);
      setSelectedSoftware(response.data);
      await loadComments(softwareId);
      await loadRatings(softwareId);
    } catch (error) {
      console.error('Error fetching software details:', error);
    }
  };

  // Load comments for software
  const loadComments = async (softwareId) => {
    try {
      const response = await fetchCommentsBySoftwareId(softwareId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Add a comment
  const handleAddComment = async (commentData) => {
    try {
      const response = await addComment(commentData);
      setComments((prevComments) => [...prevComments, response.data]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Load ratings for software
  const loadRatings = async (softwareId) => {
    try {
      const response = await fetchRatingsBySoftwareId(softwareId);
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // Add or update a rating
  const handleAddOrUpdateRating = async (ratingData) => {
    try {
      const response = await addOrUpdateRating(ratingData);
      setRatings((prevRatings) => {
        const existingRatingIndex = prevRatings.findIndex(
          rating => rating.user.id === ratingData.user.id && rating.software.id === ratingData.software.id
        );
        if (existingRatingIndex !== -1) {
          // Update existing rating
          const updatedRatings = [...prevRatings];
          updatedRatings[existingRatingIndex] = response.data;
          return updatedRatings;
        }
        // Add new rating
        return [...prevRatings, response.data];
      });
    } catch (error) {
      console.error('Error adding or updating rating:', error);
    }
  };

  // Download software
  const download = async (softwareId) => {
    try {
      const response = await downloadSoftware(softwareId);
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `software_${softwareId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading software:', error);
    }
  };

  // Create software (admin)
  const createNewSoftware = async (softwareData) => {
    try {
      const response = await createSoftware(softwareData);
      setSoftwares((prevSoftwares) => [...prevSoftwares, response.data]);
    } catch (error) {
      console.error('Error creating software:', error);
    }
  };

  // Update software (admin)
  const updateSoftware = async (softwareId, updatedData) => {
    try {
      const response = await editSoftware(softwareId, updatedData);
      setSoftwares((prevSoftwares) => 
        prevSoftwares.map((soft) => (soft.id === softwareId ? { ...soft, ...response.data } : soft))
      );
    } catch (error) {
      console.error('Error updating software:', error);
    }
  };

  // Delete software (admin)
  const deleteSoftwareById = async (softwareId) => {
    try {
      await deleteSoftware(softwareId);
      setSoftwares((prevSoftwares) => prevSoftwares.filter((soft) => soft.id !== softwareId));
    } catch (error) {
      console.error('Error deleting software:', error);
    }
  };

  // Upload software image
  const uploadSoftwareImageFile = async (softwareId, file) => {
    try {
      const response = await uploadSoftwareImage(softwareId, file);
      setSoftwares((prevSoftwares) =>
        prevSoftwares.map((soft) => (soft.id === softwareId ? { ...soft, ...response.data } : soft))
      );
    } catch (error) {
      console.error('Error uploading software image:', error);
    }
  };

  // Upload software file
  const uploadSoftwareFileData = async (softwareId, file) => {
    try {
      const response = await uploadSoftwareFile(softwareId, file);
      setSoftwares((prevSoftwares) =>
        prevSoftwares.map((soft) => (soft.id === softwareId ? { ...soft, ...response.data } : soft))
      );
    } catch (error) {
      console.error('Error uploading software file:', error);
    }
  };

  return (
    <SoftwareContext.Provider value={{ 
      softwares, 
      selectedSoftware, 
      comments, 
      ratings, 
      getSoftwareDetails, 
      handleAddComment, 
      handleAddOrUpdateRating, 
      download, 
      createNewSoftware, 
      updateSoftware, 
      deleteSoftwareById,
      uploadSoftwareImageFile,
      uploadSoftwareFileData
    }}>
      {children}
    </SoftwareContext.Provider>
  );
};

export default SoftwareProvider;
