import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Modal } from 'antd';
import { useAuth } from '../providers/AuthProvider';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const { login, setUser } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      navigate('/'); // Điều hướng tới trang chủ
    } catch (error) {
      setError(error.message);
      setIsModalVisible(true);
    }
    setLoading(false);
  };
  
  const handleRegister = () => {
    setIsModalVisible(false);
    navigate('/register');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Title level={2}>Đăng nhập</Title>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      {error && (
        <Modal
          title="Lỗi đăng nhập"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="register" type="primary" onClick={handleRegister}>
              Đăng ký
            </Button>,
          ]}
        >
          <p>{error}</p>
        </Modal>
      )}
      <div style={{ marginTop: '16px' }}>
        <Button type="link" onClick={handleRegister}>
          Nếu chưa có tài khoản, hãy đăng ký tại đây
        </Button>
      </div>
    </div>
  );
};

export default Login;
