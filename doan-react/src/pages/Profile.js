import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Select, Typography, message, Modal } from 'antd';
import { useAuth } from '../providers/AuthProvider';
import { useUsers } from '../providers/UserProvider';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const Profile = () => {
    const { user } = useAuth();
    const { updateUser } = useUsers();
    const [form, passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    

    const onFinish = async (values) => {
        setLoading(true);
        const updatedUser = {
            ...user,
            fullName: values.fullName,
            email: values.email,
            birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
            gender: values.gender,
            phoneNumber: values.phoneNumber,
        };
        
        try {
            await updateUser(user.id, updatedUser);
            message.success('Cập nhật thông tin thành công');
        } catch (error) {
            message.error('Cập nhật thông tin thất bại');
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();
    const handleHomeClick = () => {
        navigate('/');
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            await passwordForm.validateFields();
            const values = passwordForm.getFieldsValue();
            if (values.oldPassword !== user.password) {
                message.error('Mật khẩu cũ không đúng!');
                return;
            }

            const updatedUser = {
                ...user,
                password: values.password,
            };

            await updateUser(updatedUser);  // Gọi API cập nhật pass
            message.success('Cập nhật mật khẩu thành công');
            setIsModalVisible(false);
            passwordForm.resetFields();
        } catch (info) {
            console.log('Validate Failed:', info);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ margin: '10px' }}>
            <Title level={2}>Thông tin cá nhân</Title>
            <Button type="primary" onClick={handleHomeClick} style={{ textAlign: 'right', marginTop: '5px', marginBottom: '5px' }}>
                Trở về trang chính
            </Button>
            <Form
                form={form}
                name="profile"
                initialValues={{
                    fullName: user.fullName,
                    email: user.email,
                    birthDate: user.birthDate ? dayjs(user.birthDate) : null,
                    gender: user.gender,
                    phoneNumber: user.phoneNumber,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="fullName"
                    label="Họ và Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="birthDate"
                    label="Ngày/Tháng/Năm Sinh"
                >
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="Giới Tính"
                >
                    <Select placeholder="Chọn giới tính">
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="phoneNumber"
                    label="Số Điện Thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cập nhật
                    </Button>
                    <Button type="default" onClick={showModal} style={{ marginLeft: '10px' }}>
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title="Đổi mật khẩu"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    form={passwordForm}
                    name="passwordForm"
                    initialValues={{}}
                >
                    <Form.Item
                        name="oldPassword"
                        label="Mật khẩu cũ"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu mới"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
