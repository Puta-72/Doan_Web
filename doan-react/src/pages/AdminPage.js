import React, { useEffect, useState } from 'react';
import { Tabs, Layout, Button, Menu, Dropdown, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../providers/AuthProvider';
import axios from 'axios';
import AdminUsers from './AdminUsers';
import AdminDocuments from './AdminDocuments';
import AdminCourses from './AdminCourses';
import AdminSoftwares from './AdminSoftwares';

const { TabPane } = Tabs;
const { Content, Header: AntHeader } = Layout;

const AdminPage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuModalVisible, setIsMenuModalVisible] = React.useState(false);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [softwares, setSoftwares] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user.role === 'admin') {
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  const fetchAdminData = async () => {
    try {
      const usersResponse = await axios.get('/api/users');
      setUsers(usersResponse.data);

      const documentsResponse = await axios.get('/api/documents');
      setDocuments(documentsResponse.data);

      const coursesResponse = await axios.get('/api/courses');
      setCourses(coursesResponse.data);

      const softwaresResponse = await axios.get('/api/softwares');
      setSoftwares(softwaresResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu quản lý.');
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const showMenuModal = () => {
    setIsMenuModalVisible(true);
  };

  const handleMenuCancel = () => {
    setIsMenuModalVisible(false);
  };

  const guestMenu = (
    <Menu style={{ backgroundColor: '#38385C', color: '#FFEAAA' }}>
      <Menu.Item key="0">
        <a onClick={() => navigate('/login')} style={{ color: '#FFEAAA' }}>Đăng nhập</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a onClick={() => navigate('/register')} style={{ color: '#FFEAAA' }}>Đăng ký</a>
      </Menu.Item>
    </Menu>
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = (
    <Menu style={{ backgroundColor: '#38385C', color: '#FFEAAA' }}>
      <Menu.Item key="home" onClick={() => navigate('/')} style={{ color: '#FFEAAA' }}>
        Trang chủ
      </Menu.Item>
      <Menu.Item key="documents" onClick={() => navigate('/documents')} style={{ color: '#FFEAAA' }}>
        Tài liệu
      </Menu.Item>
      <Menu.Item key="courses" onClick={() => navigate('/courses')} style={{ color: '#FFEAAA' }}>
        Khóa học
      </Menu.Item>
      <Menu.Item key="software" onClick={() => navigate('/software')} style={{ color: '#FFEAAA' }}>
        Phần mềm
      </Menu.Item>
    </Menu>
  );

  const authMenu = (
    <Menu style={{ backgroundColor: '#38385C' }}>
      <Menu.Item key="0">
        <a onClick={() => navigate('/profile')} style={{ color: '#FFEAAA' }}>Thông tin cá nhân</a>
      </Menu.Item>
      <Menu.Item key="1" onClick={handleLogout} style={{ color: '#FFEAAA' }}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AntHeader className="header" style={{ backgroundColor: '#38385C', color: '#FFEAAA' }}>
        <Dropdown overlay={menuItems} trigger={['hover']} placement="bottomLeft">
          <Button type="text" icon={<MenuOutlined />} className="menu-button" />
        </Dropdown>
        <Button type="link" onClick={handleHomeClick} className="logo-button" style={{ color: '#FFEAAA' }}>
          LOGO
        </Button>
        <h2 className="title">Admin Page</h2>
        <div className="user-info" style={{ float: 'right' }}>
          <Dropdown overlay={isAuthenticated ? authMenu : guestMenu} trigger={['hover']} id='ava' shape="circle">
            <UserOutlined style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '31px', width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#FFEAAA', color: '#38385C' }} alt="Profile" />
          </Dropdown>
        </div>
      </AntHeader>
      <Content style={{ padding: '24px' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Quản lý Người dùng" key="1">
            <AdminUsers users={users} />
          </TabPane>
          <TabPane tab="Quản lý Tài liệu" key="2">
            <AdminDocuments documents={documents} />
          </TabPane>
          <TabPane tab="Quản lý Khóa học" key="3">
            <AdminCourses courses={courses} />
          </TabPane>
          <TabPane tab="Quản lý Phần mềm" key="4">
            <AdminSoftwares softwares={softwares} />
          </TabPane>
        </Tabs>
      </Content>
      <Modal
        title="Menu"
        visible={isMenuModalVisible}
        onCancel={handleMenuCancel}
        footer={null}
        style={{ top: 0, left: 0, margin: 0, padding: 0 }}
        width={250}
      >
        {menuItems}
      </Modal>
    </Layout>
  );
};

export default AdminPage;
