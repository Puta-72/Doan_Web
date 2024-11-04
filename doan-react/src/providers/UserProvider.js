import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsers, createUser, editUser, deleteUser} from '../api';

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  const createNewUser = async (fullName, email, username, password, role) => {
    try {
      const response = await createUser(fullName, email, username, password, role);
      setUsers((prevUsers) => [...prevUsers, response.data]);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const updateUser = async (userId, updatedData) => {
    try {
      const response = await editUser(userId, updatedData);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, ...response.data } : user))
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUserById = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      selectedUser, 
      createNewUser, 
      updateUser, 
      deleteUserById 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
