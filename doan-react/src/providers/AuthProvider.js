import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, getUserByUsername } from '../api';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1]; // Lấy payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64)); // giải mã sang JSON
    } catch (error) {
      console.error('Token không hợp lệ:', error);
      return null;
    }
  };

  const fetchUserProfile = async (username) => {
    try {
      const response = await getUserByUsername(username);
      setUser(response.data); // thông tin từ API và MySQL trực tiếp
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Đăng nhập
  const login = async (username, password) => {
    try {
      const response = await loginUser(username, password);
      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem('authToken', token); // Lưu token
        setAuthToken(token);
  
        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.sub) {
          await fetchUserProfile(decodedToken.sub);
          const userProfile = await getUserByUsername(decodedToken.sub);
          const userData = userProfile.data;
  
          // Kiểm tra vai trò và lưu vào localStorage
          localStorage.setItem('authUser', JSON.stringify(userData));
          localStorage.setItem('isAdmin', userData.role === 'ROLE_ADMIN');
          setUser(userData);
        }
      } else {
        throw new Error('Thông tin đăng nhập không hợp lệ');
      }
    } catch (error) {
      throw new Error('Thông tin đăng nhập không hợp lệ');
    }
  };

  // Đăng ký
  const register = async (fullName, email, username, password) => {
    try {
      const response = await registerUser({ fullName, email, username, password });
      const newUser = response.data.user;
      localStorage.setItem('authToken', response.data.token); // Lưu token localStorage
      setAuthToken(response.data.token); // add token vào state

      const userRole = newUser.role || 'USER'; // Mặc định là "USER"
    localStorage.setItem('authUser', JSON.stringify(newUser));
    localStorage.setItem('isAdmin', userRole === 'ROLE_ADMIN');

      setUser(newUser);

    window.location.reload();

    // Điều hướng dựa trên vai trò
    if (userRole === 'ROLE_ADMIN') {
      Navigate('/admin');
    } else {
      Navigate('/');
    }

      return newUser;
    } catch (error) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }
  };

  // Đăng xuất
  const logout = async () => {
    await logoutUser();
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
  };

  const isAuthenticated = !!authToken && !!user;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !user) {
      const decodedToken = parseJwt(token);
      if (decodedToken && decodedToken.sub) {
        fetchUserProfile(decodedToken.sub);
      }
    }
  }, [authToken, user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
