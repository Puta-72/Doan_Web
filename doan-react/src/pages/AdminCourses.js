import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Radio, message, Upload, List, Rate, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCourses } from '../providers/CourseProvider';

const AdminCourses = () => {
  const {
    courses,
    getCourseDetails,
    selectedCourse,
    setSelectedCourse,
    comments,
    ratings,
    deleteCourseById,
    handleAddComment,
    handleAddOrUpdateRating,
    deleteComment,
    deleteRating,
    createNewCourse,
    updateCourse
  } = useCourses();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const formatPrice = (value) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleEdit = (record) => {
    setSelectedCourse(record);
    form.setFieldsValue({ ...record, price: formatPrice(String(record.price)) });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourseById(id);
      message.success('Xóa khóa học thành công');
    } catch (error) {
      message.error('Error deleting course');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCourse(null);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleFeedbackCancel = () => {
    setIsFeedbackModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedValues = { ...values, price: values.price.replace(/\./g, '') };
      await updateCourse(selectedCourse.id, updatedValues);
      message.success('Cập nhật khóa học thành công');
      setIsModalVisible(false);
      setSelectedCourse(null);
    } catch (error) {
      message.error('Error updating course');
    }
  };

  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      const newCourse = { ...values, price: values.price.replace(/\./g, '') };
      await createNewCourse(newCourse);
      message.success('Thêm khóa học thành công');
      setIsAddModalVisible(false);
    } catch (error) {
      message.error('Error adding course');
    }
  };

  const handleImageUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => {
      form.setFieldsValue({ image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => {
      addForm.setFieldsValue({ image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleViewFeedbacks = async (record) => {
    await getCourseDetails(record.id);
    setIsFeedbackModalVisible(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên khóa học', dataIndex: 'title', key: 'title' },
    { title: 'Trạng thái', dataIndex: 'new', key: 'new', render: (text, record) => (record.new ? <Tag color="green">New</Tag> : <Tag color="blue">Old</Tag>) },
    { title: 'Hình ảnh', dataIndex: 'image', key: 'image', render: (text) => <img src={text} alt="course" style={{ width: '100px' }} /> },
    { title: 'Giá tiền', dataIndex: 'price', key: 'price', render: (text) => <span>{Number(text).toLocaleString('vi-VN')} VND</span> },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => handleViewFeedbacks(record)}>Đánh giá</Button>
          <Button onClick={() => handleEdit(record)} style={{ marginLeft: 8 }}>Sửa</Button>
          <Button onClick={() => handleDelete(record.id)} danger style={{ marginLeft: 8 }}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: 16 }}>Thêm khóa học mới</Button>
      <Table columns={columns} dataSource={courses} rowKey="id" />
      <Modal title="Edit Course" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="ID">
            <Input disabled />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="new" label="New" rules={[{ required: true, message: 'Please specify if it is new!' }]}>
            <Radio.Group>
              <Radio value={true}>Có</Radio>
              <Radio value={false}>Không</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <Input />
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload beforeUpload={() => false} onChange={handleImageUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price!' }]}>
            <Input onChange={(e) => form.setFieldsValue({ price: formatPrice(e.target.value) })} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Add Course" visible={isAddModalVisible} onOk={handleAddOk} onCancel={handleAddCancel}>
        <Form form={addForm} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="new" label="New" rules={[{ required: true, message: 'Please specify if it is new!' }]}>
            <Radio.Group>
              <Radio value={true}>Có</Radio>
              <Radio value={false}>Không</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <Input />
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload beforeUpload={() => false} onChange={handleAddImageUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price!' }]}>
            <Input onChange={(e) => addForm.setFieldsValue({ price: formatPrice(e.target.value) })} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Feedbacks" visible={isFeedbackModalVisible} onCancel={handleFeedbackCancel} footer={null}>
        {selectedCourse && (
          <List
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.user.fullName}
                  description={item.content}
                />
                <div>
                  <Rate disabled value={item.ratingValue} />
                  <div>{new Date(item.timestamp).toLocaleString()}</div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminCourses;
