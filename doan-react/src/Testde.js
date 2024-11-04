import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message, AutoComplete } from 'antd';
import { useAuth } from '../providers/AuthProvider';

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [emailOptions, setEmailOptions] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values.fullName, values.email, values.username, values.password);
      message.success('Đăng ký thành công');
      navigate('/');
    } catch (error) {
      if (error.message === 'Tên đăng nhập đã tồn tại') {
        message.error('Tên đăng nhập đã tồn tại, vui lòng chọn tên khác');
      } else {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value) => {
    if (!value || value.indexOf('@') >= 0) {
      setEmailOptions([]);
    } else {
      setEmailOptions([
        `${value}@gmail.com`,
        `${value}@yahoo.com`,
      ]);
    }
  };

  const validateConfirmPassword = (_, value) => {
    if (value && value !== form.getFieldValue('password')) {
      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
    }
    return Promise.resolve();
  };

  const [form] = Form.useForm();

  return (
    <div>
      <Title level={2}>Đăng ký</Title>
      <Form 
        form={form}
        name="register" 
        initialValues={{ remember: true }} 
        onFinish={onFinish}
      >
        <Form.Item 
          name="fullName" 
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input placeholder="Họ và Tên" />
        </Form.Item>
        <Form.Item 
          name="email" 
          rules={[
            { required: true, message: 'Vui lòng nhập email!' }, 
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <AutoComplete
            options={emailOptions.map((email) => ({ value: email }))}
            onChange={handleEmailChange}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item 
          name="username" 
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>
        <Form.Item 
          name="password" 
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
            { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: 'Mật khẩu phải có cả chữ và số!' }
          ]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item 
          name="confirmPassword" 
          dependencies={['password']} 
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            { validator: validateConfirmPassword }
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: '16px' }}>
        <Button type="link" onClick={() => navigate('/login')}>
          Nếu bạn đã có tài khoản, hãy đăng nhập tại đây
        </Button>
      </div>
    </div>
  );
};

export default Register;
