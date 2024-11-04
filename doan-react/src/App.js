import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import UserProvider from './providers/UserProvider';
import CoursesProvider from './providers/CourseProvider';
import DocumentsProvider from './providers/DocumentProvider';
import SoftwaresProvider from './providers/SoftwareProvider';
import CartProvider from './providers/CartProvider';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Documents from './pages/Documents';
import Courses from './pages/Courses';
import Software from './pages/Software';
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';
import Cart from './pages/Cart'; 
import PrivateRoute from './components/PrivateRoute';
import ProtectRoute from './components/ProtectRoute';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
      <CoursesProvider>
        <DocumentsProvider>
          <SoftwaresProvider>
            <CartProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<ProtectRoute><AuthLayout><Login /></AuthLayout></ProtectRoute>} />
                  <Route path="/register" element={<ProtectRoute><AuthLayout><Register /></AuthLayout></ProtectRoute>} />
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                  </Route>
                  <Route path="/profile" element={<PrivateRoute><AuthLayout><Profile /></AuthLayout></PrivateRoute>} />
                  <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
                  <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
                  <Route path="/software" element={<PrivateRoute><Software /></PrivateRoute>} />
                  <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                  <Route path="/admin" element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </CartProvider>
          </SoftwaresProvider>
        </DocumentsProvider>
      </CoursesProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
