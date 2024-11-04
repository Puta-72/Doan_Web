import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Input, Modal, Rate, Form, List, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useDocuments } from '../providers/DocumentProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Layouts.css';

const { Content } = Layout;
const { TextArea } = Input;

const Documents = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    documents,
    getDocumentDetails,
    selectedDocument,
    setSelectedDocument,
    comments,
    ratings,
    handleAddComment,
    handleAddOrUpdateRating,
    downloadDocumentFile,
  } = useDocuments();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const showDocumentModal = async (document) => {
    await getDocumentDetails(document.id);
    setIsDocumentModalVisible(true);
  };

  const handleDocumentCancel = () => {
    setIsDocumentModalVisible(false);
    setSelectedDocument(null);
  };

  const handleCommentSubmit = (values) => {
    if (selectedDocument && user) {
      const newComment = {
        userId: user.id,
        documentId: selectedDocument.id,
        content: values.comment,
      };
      handleAddComment(newComment);
      form.resetFields();
    }
  };

  const handleRateChange = (value) => {
    if (selectedDocument && user) {
      const ratingData = {
        userId: user.id,
        documentId: selectedDocument.id,
        ratingValue: value,
      };
      handleAddOrUpdateRating(ratingData);
    }
  };

  const getAverageRating = () => {
    if (ratings.length === 0) return 0;
    const totalRatings = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0);
    return totalRatings / ratings.length;
  };

  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (documentId) => {
    downloadDocumentFile(documentId);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header title="TÀI LIỆU" onSearch={handleSearch} />
      <Content style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {filteredDocuments.map(document => (
            <Col key={document.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={document.title} src={`data:image/jpeg;base64,${document.image}`} />}
                className="layouts-card"
                onClick={() => showDocumentModal(document)}
              >
                <Card.Meta title={document.title} />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
      <Footer />

      <Modal
        title={selectedDocument?.title}
        visible={isDocumentModalVisible}
        onCancel={handleDocumentCancel}
        footer={null}
      >
        {selectedDocument && (
          <>
            <p><b>Tên tài liệu:</b> {selectedDocument.title}</p>
            <p>
              <b>Link tải tài liệu:</b> 
              <Button type="link" onClick={() => handleDownload(selectedDocument.id)}>
                Download
              </Button>
            </p>
            <p><b>Trung bình đánh giá:</b> {getAverageRating().toFixed(1)} / 5</p>
            <Rate value={ratings.find(r => r.user.id === user.id)?.ratingValue || 0} onChange={handleRateChange} />
            <Form form={form} onFinish={handleCommentSubmit}>
              <Form.Item name="comment" rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}>
                <TextArea rows={4} placeholder="Nhập nhận xét của bạn" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Gửi nhận xét
                </Button>
              </Form.Item>
            </Form>
            <List
              className="comment-list"
              header={`${comments.length} nhận xét`}
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={props => (
                <List.Item>
                  <List.Item.Meta
                    title={props.user.fullName}
                    description={props.content}
                  />
                  <div>{new Date(props.timestamp).toLocaleString()}</div>
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default Documents;
