import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:8080';
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_URL + '/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        message.error('Không thể tải danh sách người dùng');
      }
    };
    fetchUsers();
  }, []);

  // Xóa người dùng
  const handleDelete = async (username) => {
    try {
      await axios.delete(API_URL + `/api/users/${username}`);
      setUsers(users.filter(user => user.username !== username));
      message.success('Xóa người dùng thành công');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Xóa người dùng thất bại');
    }
  };

  // Hiển thị thông tin người dùng
  const handleView = (record) => {
    setSelectedUser(record);
    setIsViewModalVisible(true);
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setSelectedUser(null);
  };

  // Cấu trúc bảng hiển thị người dùng
  const columns = [
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
    { title: 'Họ và Tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role' },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <>
          <Button onClick={() => handleView(record)}>Xem</Button>
          <Button onClick={() => handleDelete(record.username)} danger style={{ marginLeft: 8 }}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={users} rowKey="username" />
      <Modal title="Thông tin người dùng" visible={isViewModalVisible} onCancel={handleCancel} footer={null}>
        {selectedUser && (
          <div>
            <p><b>Tên đăng nhập:</b> {selectedUser.username}</p>
            <p><b>Họ và Tên:</b> {selectedUser.fullName}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Ngày/Tháng/Năm Sinh:</b> {selectedUser.birthDate ? dayjs(selectedUser.birthDate).format('DD/MM/YYYY') : 'Chưa cập nhật'}</p>
            <p><b>Giới Tính:</b> {selectedUser.gender ? selectedUser.gender : 'Chưa cập nhật'}</p>
            <p><b>Số Điện Thoại:</b> {selectedUser.phoneNumber ? selectedUser.phoneNumber : 'Chưa cập nhật'}</p>
            <p><b>Vai trò:</b> {selectedUser.role}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
