import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Button, Modal, FloatButton } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  HomeOutlined, FileOutlined, BookOutlined, AppstoreOutlined, MenuOutlined,
  UserOutlined, FacebookOutlined, MessageOutlined, TwitterOutlined, CloseOutlined
} from '@ant-design/icons';
import { useAuth } from '../providers/AuthProvider';
import styles from './MainLayout.module.css';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [siderVisible, setSiderVisible] = useState(!isMobile);
  const { isAuthenticated, user, logout, setUser } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [floatButtonVisible, setFloatButtonVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleSider = () => {
    setSiderVisible(!siderVisible);
  };

  const handleOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (latestOpenKey === "sub1" || latestOpenKey === "sub2") {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    } else {
      setOpenKeys(keys);
    }
  };

  const handleFloatButtonClick = () => {
    setFloatButtonVisible(!floatButtonVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setSiderVisible(false);
      } else {
        setIsMobile(false);
        setSiderVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('authUser'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsModalVisible(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setIsModalVisible(false);
  };

  const handleNavigation = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      showModal();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authMenu = (
    <Menu style={{ backgroundColor: '#38385C', color: '#FFEAAA' }}>
      <Menu.Item key="0">
        <Link to="/profile" style={{ color: '#FFEAAA' }}>Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="1" onClick={handleLogout} style={{ color: '#FFEAAA' }}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const guestMenu = (
    <Menu style={{ backgroundColor: '#38385C', color: '#FFEAAA' }}>
      <Menu.Item key="0">
        <Link to="/login" style={{ color: '#FFEAAA' }}>Đăng nhập</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/register" style={{ color: '#FFEAAA' }}>Đăng ký</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {siderVisible && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleCollapse}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: '#38385C',
          }}
        >
          <div className="logo" style={{ height: '32px', margin: '16px' }}>
            <h1 style={{ color: '#FFEAAA' }}>LOGO</h1>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            style={{ backgroundColor: '#38385C', color: '#FFEAAA' }}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
          >
            <SubMenu key="sub1" icon={<HomeOutlined />} title="Trang chủ" style={{ color: '#FFEAAA' }}>
              <Menu.Item key="1.1" style={{ color: '#FFEAAA' }}>
                <Link to="/#gioi-thieu" style={{ color: '#FFEAAA' }}>Giới thiệu trang</Link>
              </Menu.Item>
              <Menu.Item key="1.2" style={{ color: '#FFEAAA' }}>
                <Link to="/#cach-su-dung" style={{ color: '#FFEAAA' }}>Cách sử dụng</Link>
              </Menu.Item>
              <Menu.Item key="1.3" style={{ color: '#FFEAAA' }}>
                <Link to="/#tai-lieu-moi" style={{ color: '#FFEAAA' }}>Tài liệu mới nhất</Link>
              </Menu.Item>
              <Menu.Item key="1.4" style={{ color: '#FFEAAA' }}>
                <Link to="/#khoa-hoc-moi" style={{ color: '#FFEAAA' }}>Khóa học mới nhất</Link>
              </Menu.Item>
              <Menu.Item key="1.5" style={{ color: '#FFEAAA' }}>
                <Link to="/#phan-mem-moi" style={{ color: '#FFEAAA' }}>Phần mềm mới nhất</Link>
              </Menu.Item>
            </SubMenu>

            <Menu.Item key="2" icon={<FileOutlined />} onClick={() => handleNavigation('/documents')} style={{ color: '#FFEAAA' }}>
              Tài liệu
            </Menu.Item>

            <Menu.Item key="3" icon={<BookOutlined />} onClick={() => handleNavigation('/courses')} style={{ color: '#FFEAAA' }}>
              Khóa học
            </Menu.Item>

            <Menu.Item key="4" icon={<AppstoreOutlined />} onClick={() => handleNavigation('/software')} style={{ color: '#FFEAAA' }}>
              Phần mềm
            </Menu.Item>
          </Menu>
        </Sider>
      )}

      <Layout className="site-layout" style={{ marginLeft: siderVisible && !isMobile ? (collapsed ? 80 : 200) : 0, transition: 'margin-left 0.2s', backgroundColor: '#38385C' }}>
        <Header className="site-layout-background" style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#38385C', color: '#FFEAAA' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <Button type="primary" icon={<MenuOutlined />} onClick={toggleSider} style={{ color: '#FFEAAA', border: 'none', background: 'transparent', marginRight: '16px' }} />
            )}
            <h1 style={{ color: '#FFEAAA', margin: '0px' }}>Education</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated && (
              <>
                <span style={{ color: '#FFEAAA', marginRight: '16px' }}>Hello, {user?.fullName}</span> {/* Cập nhật tên người dùng */}
                {user?.role === 'ROLE_ADMIN' && (
                  <Button type="primary" onClick={() => navigate('/admin')} style={{ marginRight: '16px', backgroundColor: '#FFEAAA', color: '#38385C' }}>
                    Quản lý
                  </Button>
                )}
              </>
            )}
            <Dropdown overlay={isAuthenticated ? authMenu : guestMenu} trigger={['hover']} id='ava' shape="circle" className={styles.hoverable}>
              <UserOutlined style={{ fontSize: '31px', color: '#000', width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#FFEAAA', color: '#38385C' }} />
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: '0px', overflowX: 'hidden', backgroundColor: '#38385C', color: '#FFEAAA' }}>
          <div className="site-layout-background" style={{ padding: 0, height: 20, backgroundColor: '#38385C', color: '#FFEAAA' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      <Modal
        title="Vui lòng đăng ký hoặc đăng nhập trước ^^"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="login" type="primary" onClick={handleLogin}>
            Đăng nhập
          </Button>,
          <Button key="register" type="primary" onClick={handleRegister}>
            Đăng ký
          </Button>,
        ]}
      >
        <p>Bạn cần đăng nhập hoặc đăng ký tài khoản trước khi sử dụng ^^</p>
      </Modal>

      <div>
        <FloatButton
          icon={<UserOutlined />}
          style={{ right: 24, bottom: 24, backgroundColor: '#FFEAAA', color: '#38385C' }}
          onClick={handleFloatButtonClick}
        />
        {floatButtonVisible && (
          <div style={{ position: 'fixed', right: 24, bottom: 100 }}>
            <Button
              icon={<FacebookOutlined />}
              style={{ marginBottom: '10px', display: 'block', backgroundColor: '#FFEAAA', color: '#38385C' }}
              onClick={() => window.open('https://www.facebook.com', '_blank')}
            />
            <Button
              icon={<TwitterOutlined />}
              style={{ marginBottom: '10px', display: 'block', backgroundColor: '#FFEAAA', color: '#38385C' }}
              onClick={() => window.open('https://www.twitter.com', '_blank')}
            />
            <Button
              icon={<MessageOutlined />}
              style={{ marginBottom: '10px', display: 'block', backgroundColor: '#FFEAAA', color: '#38385C' }}
              onClick={() => window.location.href = 'mailto:example@example.com'}
            />
          </div>
        )}
        {floatButtonVisible && (
          <FloatButton
            icon={<CloseOutlined />}
            style={{ right: 24, bottom: 24, backgroundColor: '#FFEAAA', color: '#38385C' }}
            onClick={handleFloatButtonClick}
          />
        )}
      </div>
    </Layout>
  );
};

export default MainLayout;
