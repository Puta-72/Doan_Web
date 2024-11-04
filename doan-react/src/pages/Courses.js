import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Button, Input, Modal, Rate, Form, List, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useCart } from '../providers/CartProvider';
import { useCourses } from '../providers/CourseProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Layouts.css';

const { Content } = Layout;
const { TextArea } = Input;

const Courses = () => {
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const {
    courses,
    getCourseDetails,
    selectedCourse,
    comments,
    ratings,
    handleAddComment,
    handleAddOrUpdateRating
  } = useCourses();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const showCourseModal = async (course) => {
    await getCourseDetails(course.id);
    setIsCourseModalVisible(true);
  };

  const handleCourseCancel = () => {
    setIsCourseModalVisible(false);
  };

  const handleAddToCart = (course) => {
    addToCart(course);
  };

  const handleCommentSubmit = (values) => {
    if (selectedCourse && user) {
      const newComment = {
        userId: user.id,
        courseId: selectedCourse.id,
        content: values.comment,
      };
      handleAddComment(newComment);
      form.resetFields();
    }
  };

  const handleRateChange = (value) => {
    if (selectedCourse && user) {
      const ratingData = {
        userId: user.id,
        courseId: selectedCourse.id,
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

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header title="KHÓA HỌC" onSearch={handleSearch} />
      <Content className="layouts-container">
        <Row gutter={[16, 16]}>
          {filteredCourses.map(course => (
            <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={course.title} src={`data:image/jpeg;base64,${course.image}`} />}
                className="layouts-card"
                onClick={() => showCourseModal(course)}
              >
                <Card.Meta title={course.title} />
                <p>Giá: {Number(course.price).toLocaleString('vi-VN')} VND</p>
                <Button 
                  type="primary" 
                  onClick={() => handleAddToCart(course)}
                  style={{ backgroundColor: '#FFEAAA', color: '#38385C', borderColor: '#FFEAAA' }}
                >
                  Thêm vào giỏ hàng
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
      <Footer />

      <Modal
        title={selectedCourse?.title}
        visible={isCourseModalVisible}
        onCancel={handleCourseCancel}
        footer={null}
      >
        {selectedCourse && (
          <>
            <img src={selectedCourse.image} alt={selectedCourse.title} style={{ width: '100%' }} />
            <p><b>Tên khóa học:</b> {selectedCourse.title}</p>
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

export default Courses;
