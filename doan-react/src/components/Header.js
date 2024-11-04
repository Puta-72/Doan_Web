import React, { useState } from 'react';
import { Layout, Button, Menu, Dropdown, Input, Modal, Badge, List } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MenuOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '../providers/AuthProvider';
import { useCart } from '../providers/CartProvider'; // Import CartProvider

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header = ({ title, onSearch }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart, removeFromCart, checkout } = useCart(); //quản lý giả hàng
  const navigate = useNavigate();
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);

  const handleHomeClick = () => {
    navigate('/');
  };

  const showMenuModal = () => {
    setIsMenuModalVisible(true);
  };

  const handleMenuCancel = () => {
    setIsMenuModalVisible(false);
  };

  const showCartModal = () => {
    setIsCartModalVisible(true);
  };

  const handleCartCancel = () => {
    setIsCartModalVisible(false);
  };

  const handleCheckout = () => {
    checkout(user);
    setIsCartModalVisible(false);
  };

  const totalPrice = cart.reduce((total, course) => total + Number(course.price), 0);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = (
    <Menu style={{ backgroundColor: '#38385C' }}>
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
        <Link to="/profile" style={{ color: '#FFEAAA' }}>Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="1" onClick={handleLogout} style={{ color: '#FFEAAA' }}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#38385C', color: '#FFEAAA' }}>
      {/* Logo */}
      <Dropdown overlay={menuItems} trigger={['hover']} placement="bottomLeft">
        <Button type="text" icon={<MenuOutlined />} className="menu-button" />
      </Dropdown>
      <Button type="danger" onClick={handleHomeClick} className="logo-button">
        LOGO
      </Button>
      <h2 className="title" style={{ marginLeft: '20px' }}>{title}</h2>

      <div className="user-info" style={{ display: 'flex', alignItems: 'center' }}>
        {/* Thanh tìm kiếm */}
        <Search
          placeholder={`Tìm kiếm ${title.toLowerCase()}`}
          onSearch={onSearch}
          style={{ marginRight: 16 }}
        />

        {/* Cart Icon */}
        <div style={{ position: 'relative', marginRight: '20px' }}>
          <Badge 
            count={cart.length} 
            showZero 
            offset={[-5, 5]} 
            style={{ 
              backgroundColor: '#FFEAAA',
              color: '#38385C',          
              border: '1px solid #38385C',
              fontSize: '10px',           
              height: '16px',             
              minWidth: '16px',           
              lineHeight: '16px'          
            }}>
            <ShoppingCartOutlined
              style={{ fontSize: '24px', color: '#FFEAAA', cursor: 'pointer' }}
              onClick={showCartModal}
            />
          </Badge>
        </div>

        {/* Avatar Icon */}
        <Dropdown overlay={isAuthenticated ? authMenu : guestMenu} trigger={['hover']}>
          <UserOutlined style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '31px', width: '35px', height: '35px', borderRadius: '100%', backgroundColor: '#FFEAAA', color: '#38385C', cursor: 'pointer' }} />
        </Dropdown>
      </div>

      {/* Menu Modal */}
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

      {/* Cart Modal */}
      <Modal
        title="Giỏ hàng"
        visible={isCartModalVisible}
        onCancel={handleCartCancel}
        footer={[
          <div key="total" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Tổng giá: {totalPrice.toLocaleString('vi-VN')} VND
          </div>,
          <Button key="checkout" type="primary" onClick={handleCheckout} disabled={cart.length === 0}>
            Thanh toán
          </Button>,
        ]}
      >
        <List
          itemLayout="horizontal"
          dataSource={cart}
          renderItem={course => (
            <List.Item
              actions={[<Button onClick={() => removeFromCart(course.id)}>Xóa</Button>]}
            >
              <List.Item.Meta
                title={course.title}
                description={`Giá: ${course.price.toLocaleString('vi-VN')} VND`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </AntHeader>
  );
};

export default Header;
