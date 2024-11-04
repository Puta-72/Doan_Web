import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Radio, message, Upload, List, Rate, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDocuments } from '../providers/DocumentProvider';
import { uploadDocumentImage, uploadDocumentFile } from '../api';

const AdminDocuments = () => {
  const {
    documents,
    getDocumentDetails,
    selectedDocument,
    setSelectedDocument,
    comments,
    ratings,
    deleteDocumentById,
    handleAddComment,
    handleAddOrUpdateRating,
    deleteComment,
    deleteRating,
    createNewDocument,
    updateDocument
  } = useDocuments();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const handleEdit = (record) => {
    setSelectedDocument(record);
    form.setFieldsValue({ ...record });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocumentById(id);
      message.success('Xóa tài liệu thành công');
    } catch (error) {
      message.error('Lỗi khi xóa tài liệu');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateDocument(selectedDocument.id, values);
      message.success('Cập nhật tài liệu thành công');
      setIsModalVisible(false);
      setSelectedDocument(null);
    } catch (error) {
      message.error('Lỗi khi cập nhật tài liệu');
    }
  };

  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      await createNewDocument(values);
      message.success('Thêm tài liệu thành công');
      setIsAddModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi thêm tài liệu');
    }
  };

  const handleImageUpload = (info, setFields) => {
    const file = info.file;
  
    if (!selectedDocument) {
      message.error('Chưa chọn tài liệu để tải ảnh.');
      return;
    }
  
    uploadDocumentImage(selectedDocument.id, file)
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

    if (!selectedDocument) {
        message.error('Chưa chọn tài liệu để tải file.');
        return;
    }

    uploadDocumentFile(selectedDocument.id, file)
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
    setSelectedDocument(null);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleFeedbackCancel = () => {
    setIsFeedbackModalVisible(false);
  };

  const handleViewFeedbacks = async (record) => {
    await getDocumentDetails(record.id);
    setIsFeedbackModalVisible(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên tài liệu', dataIndex: 'title', key: 'title' },
    { title: 'Trạng thái', dataIndex: 'new', key: 'new', render: (text, record) => (record.new ? <Tag color="green">New</Tag> : <Tag color="blue">Old</Tag>) },
    { title: 'Hình ảnh', dataIndex: 'image', key: 'image', render: (text) => <img src={text} alt="document" style={{ width: '100px' }} /> },
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
      <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: 16 }}>Thêm tài liệu mới</Button>
      <Table columns={columns} dataSource={documents} rowKey="id" />
      <Modal title="Chỉnh sửa tài liệu" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="ID">
            <Input disabled />
          </Form.Item>
          <Form.Item name="title" label="Tên tài liệu" rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu!' }]}>
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

      <Modal title="Thêm tài liệu" visible={isAddModalVisible} onOk={handleAddOk} onCancel={handleAddCancel}>
        <Form form={addForm} layout="vertical">
          <Form.Item name="title" label="Tên tài liệu" rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu!' }]}>
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
        {selectedDocument && (
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

export default AdminDocuments;
