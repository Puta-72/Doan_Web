import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Radio, message, Upload, Tag, List, Rate } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSoftwares } from '../providers/SoftwareProvider';
import { uploadSoftwareImage, uploadSoftwareFile } from '../api';

const AdminSoftwares = () => {
  const {
    softwares,
    getSoftwareDetails,
    selectedSoftware,
    setSelectedSoftware,
    comments,
    ratings,
    deleteSoftwareById,
    handleAddComment,
    handleAddOrUpdateRating,
    deleteComment,
    deleteRating,
    createNewSoftware,
    updateSoftware,
  } = useSoftwares();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const handleEdit = (record) => {
    setSelectedSoftware(record);
    form.setFieldsValue({ ...record });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSoftwareById(id);
      message.success('Xóa phần mềm thành công');
    } catch (error) {
      message.error('Lỗi khi xóa phần mềm');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateSoftware(selectedSoftware.id, values);
      message.success('Cập nhật phần mềm thành công');
      setIsModalVisible(false);
      setSelectedSoftware(null);
    } catch (error) {
      message.error('Lỗi khi cập nhật phần mềm');
    }
  };

  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      await createNewSoftware(values);
      message.success('Thêm phần mềm thành công');
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      message.error('Lỗi khi thêm phần mềm');
    }
  };

  const handleImageUpload = (info, setFields) => {
    const file = info.file;

    if (!selectedSoftware) {
      message.error('Chưa chọn phần mềm để tải ảnh.');
      return;
    }

    uploadSoftwareImage(selectedSoftware.id, file)
      .then((response) => {
        const updatedImage = response.data.base64Image;
        setFields({ image: updatedImage });
        message.success(`${file.name} đã được tải lên thành công`);
      })
      .catch((error) => {
        message.error('Lỗi khi tải lên hình ảnh');
        console.error(error);
      });
  };

  const handleFileUpload = (info, setFields) => {
    const file = info.file;

    if (!selectedSoftware) {
      message.error('Chưa chọn phần mềm để tải file.');
      return;
    }

    uploadSoftwareFile(selectedSoftware.id, file)
      .then((response) => {
        const updatedFileData = response.data.downloadLink;
        setFields({ downloadLink: updatedFileData });
        message.success(`${file.name} đã được tải lên thành công`);
      })
      .catch((error) => {
        message.error('Lỗi khi tải lên file');
        console.error(error);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSoftware(null);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
  };

  const handleFeedbackCancel = () => {
    setIsFeedbackModalVisible(false);
  };

  const handleViewFeedbacks = async (record) => {
    await getSoftwareDetails(record.id);
    setIsFeedbackModalVisible(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên phần mềm', dataIndex: 'title', key: 'title' },
    { title: 'Trạng thái', dataIndex: 'new', key: 'new', render: (text, record) => (record.new ? <Tag color="green">New</Tag> : <Tag color="blue">Old</Tag>) },
    { title: 'Hình ảnh', dataIndex: 'image', key: 'image', render: (text) => <img src={text} alt="software" style={{ width: '100px' }} /> },
    { title: 'Link tải', dataIndex: 'downloadLink', key: 'downloadLink', render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">Download</a> },
    {
      title: 'Hành động',
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
      <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: 16 }}>Thêm phần mềm mới</Button>
      <Table columns={columns} dataSource={softwares} rowKey="id" />
      
      <Modal title="Chỉnh sửa phần mềm" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="ID">
            <Input disabled />
          </Form.Item>
          <Form.Item name="title" label="Tên phần mềm" rules={[{ required: true, message: 'Vui lòng nhập tên phần mềm!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="new" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
            <Radio.Group>
              <Radio value={true}>Có</Radio>
              <Radio value={false}>Không</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="image" label="URL hình ảnh">
            <Input />
          </Form.Item>
          <Form.Item label="Tải lên hình ảnh">
            <Upload beforeUpload={() => false} onChange={(info) => handleImageUpload(info, form.setFieldsValue)} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Tải ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="downloadLink" label="Link tải">
            <Input />
          </Form.Item>
          <Form.Item label="Tải lên file">
            <Upload beforeUpload={() => false} onChange={(info) => handleFileUpload(info, form.setFieldsValue)} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Tải file</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Thêm phần mềm" visible={isAddModalVisible} onOk={handleAddOk} onCancel={handleAddCancel}>
        <Form form={addForm} layout="vertical">
          <Form.Item name="title" label="Tên phần mềm" rules={[{ required: true, message: 'Vui lòng nhập tên phần mềm!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="new" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
            <Radio.Group>
              <Radio value={true}>Có</Radio>
              <Radio value={false}>Không</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="image" label="URL hình ảnh">
            <Input />
          </Form.Item>
          <Form.Item label="Tải lên hình ảnh">
            <Upload beforeUpload={() => false} onChange={(info) => handleImageUpload(info, addForm.setFieldsValue)} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Tải ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="downloadLink" label="Link tải">
            <Input />
          </Form.Item>
          <Form.Item label="Tải lên file">
            <Upload beforeUpload={() => false} onChange={(info) => handleFileUpload(info, addForm.setFieldsValue)} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Tải file</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Đánh giá" visible={isFeedbackModalVisible} onCancel={handleFeedbackCancel} footer={null}>
        {selectedSoftware && (
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

export default AdminSoftwares;
