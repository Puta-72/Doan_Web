import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Modal, Rate, Form, List, message, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useSoftwares } from '../providers/SoftwareProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Layouts.css';

const { Content } = Layout;
const { TextArea } = Input;

const Software = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    softwares,
    getSoftwareDetails,
    selectedSoftware,
    comments,
    ratings,
    handleAddComment,
    handleAddOrUpdateRating,
    download
  } = useSoftwares();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSoftwareModalVisible, setIsSoftwareModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const showSoftwareModal = async (software) => {
    await getSoftwareDetails(software.id);
    setIsSoftwareModalVisible(true);
  };

  const handleSoftwareCancel = () => {
    setIsSoftwareModalVisible(false);
  };

  const handleCommentSubmit = (values) => {
    if (selectedSoftware && user) {
      const newComment = {
        userId: user.id,
        softwareId: selectedSoftware.id,
        content: values.comment,
      };
      handleAddComment(newComment);
      form.resetFields();
    }
  };

  const handleRateChange = (value) => {
    if (selectedSoftware && user) {
      const ratingData = {
        userId: user.id,
        softwareId: selectedSoftware.id,
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

  const filteredSoftwares = softwares.filter(software =>
    software.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (software) => {
    download(software.id);
  };

  return (
    <Layout style={{ minHeight: '200vh' }}>
      <Header title="PHẦN MỀM" onSearch={handleSearch} />
      <Content className="layouts-container">
        <Row gutter={[16, 16]}>
          {filteredSoftwares.map(software => (
            <Col key={software.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={software.title} src={`data:image/jpeg;base64,${software.image}`} />}
                className="layouts-card"
                onClick={() => showSoftwareModal(software)}
              >
                <Card.Meta title={software.title} />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
      <Footer />

      <Modal
        title={selectedSoftware?.title}
        visible={isSoftwareModalVisible}
        onCancel={handleSoftwareCancel}
        footer={null}
      >
        {selectedSoftware && (
          <>
            <img src={selectedSoftware.image} alt={selectedSoftware.title} style={{ width: '100%' }} />
            <p><b>Tên phần mềm:</b> {selectedSoftware.title}</p>
            <p><b>Link tải phần mềm:</b> <a href="#!" onClick={() => handleDownload(selectedSoftware)}>Download</a></p>
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

export default Software;
