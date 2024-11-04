import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal } from 'antd';
import axios from 'axios';

const API_URL = 'http://localhost:8080';
const AdminCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/api/cart');
        setCartItems(response.data);
      } catch (error) {
        message.error('Lỗi khi tải dữ liệu giỏ hàng');
      }
    };

    fetchCartItems();
  }, []);

  const handleViewDetails = (cartItem) => {
    setSelectedCartItem(cartItem);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCartItem(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL + `/api/cart/${id}`);
      setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== id));
      message.success('Xóa sản phẩm khỏi giỏ hàng thành công');
    } catch (error) {
      message.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên khóa học', dataIndex: 'courseTitle', key: 'courseTitle' },
    { title: 'Người mua', dataIndex: 'buyer', key: 'buyer' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (text) => `${Number(text).toLocaleString('vi-VN')} VND` },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <>
          <Button onClick={() => handleViewDetails(record)}>Chi tiết</Button>
          <Button onClick={() => handleDelete(record.id)} danger style={{ marginLeft: 8 }}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={cartItems} rowKey="id" />
      <Modal
        title="Chi tiết sản phẩm trong giỏ hàng"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedCartItem && (
          <div>
            <p><b>ID:</b> {selectedCartItem.id}</p>
            <p><b>Tên khóa học:</b> {selectedCartItem.courseTitle}</p>
            <p><b>Người mua:</b> {selectedCartItem.buyer}</p>
            <p><b>Giá:</b> {Number(selectedCartItem.price).toLocaleString('vi-VN')} VND</p>
            <p><b>Ngày mua:</b> {new Date(selectedCartItem.purchaseDate).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminCart;
