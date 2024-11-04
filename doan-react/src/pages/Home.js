import React, { useRef, useEffect, useState } from 'react';
import { Layout, Typography, Button, Modal } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { DoubleRightOutlined } from '@ant-design/icons';
import Slider from "react-slick";
import { useAuth } from '../providers/AuthProvider';
import axios from 'axios';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  const location = useLocation();
  const gioiThieuRef = useRef(null);
  const cachSuDungRef = useRef(null);
  const taiLieuMoiRef = useRef(null);
  const khoaHocMoiRef = useRef(null);
  const phanMemMoiRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const  API_URL = 'http://localhost:8080';

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        if (location.hash === "#gioi-thieu") {
          gioiThieuRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (location.hash === "#cach-su-dung") {
          cachSuDungRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (location.hash === "#tai-lieu-moi") {
          taiLieuMoiRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (location.hash === "#khoa-hoc-moi") {
          khoaHocMoiRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (location.hash === "#phan-mem-moi") {
          phanMemMoiRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [location]);

  useEffect(() => {
    axios.get(API_URL + '/api/documents/new')
      .then(response => setDocuments(response.data))
      .catch(error => console.error('Error fetching documents:', error));

    axios.get(API_URL + '/api/courses/new')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));

    axios.get(API_URL + '/api/software/new')
      .then(response => setSoftwares(response.data))
      .catch(error => console.error('Error fetching software:', error));
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsModalVisible(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setIsModalVisible(false);
  };

  const handleNavigation = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      showModal();
    }
  };

  const itemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    margin: '5px',
  };

  const imgStyle = {
    width: 'auto',
    maxHeight: '300px',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto',
  };

  const getCarouselSettings = (items) => ({
    dots: true,
    infinite: items.length > 1,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  return (
    <Layout style={{ minHeight: '300vh' }}>
      <Content>
        <div className="site-layout-background">
          <Slider autoplay autoplaySpeed={3000} dotPosition="top">
            <div>
              <img src="/Picture/Carousel1.png" style={{ width: '100%', height: '525px' }} alt="Carousel1" />
            </div>
            <div>
              <img src="/Picture/Carousel2.png" style={{ width: '100%', height: '525px' }} alt="Carousel2" />
            </div>
            <div>
              <img src="/Picture/Carousel3.png" style={{ width: '100%', height: '525px' }} alt="Profile" />
            </div>
            <div>
              <img src="/Picture/Carousel4.png" style={{ width: '100%', height: '525px' }} alt="Profile" />
            </div>
          </Slider>
          <div ref={gioiThieuRef} style={{ marginLeft: '16px' }}>
            <Title level={2} style={{ color: '#38385C' }}>Giới thiệu trang web</Title>
            <Paragraph style={{ color: '#38385C' }}>
              Đây là trang web hỗ trợ học tập cho sinh viên và người dùng. Trang web cung cấp các tài liệu học tập, khóa học, phần mềm, và các thông tin liên hệ cần thiết...
            </Paragraph>
          </div>
          <div ref={cachSuDungRef} style={{ marginLeft: '16px' }}>
            <Title level={2} style={{ color: '#38385C' }}>Cách sử dụng</Title>
            <Paragraph style={{ color: '#38385C' }}>
              Bạn có thể điều hướng qua các mục tài liệu, khóa học, phần mềm, và liên hệ thông qua thanh sidebar bên trái. Đăng nhập để truy cập đầy đủ các tính năng và tài liệu...
            </Paragraph>
          </div>
          <div ref={taiLieuMoiRef} style={{ marginLeft: '16px' }}>
            <Title level={2} style={{ color: '#38385C' }}>Tài liệu mới cập nhật</Title>
            <Paragraph style={{ color: '#38385C' }}>
              Dưới đây là các tài liệu học tập mới cập nhật...
            </Paragraph>
            {documents.length > 0 ? (
              <Slider {...getCarouselSettings(documents)}>
                {documents.map(doc => (
                  <div key={doc.id} style={itemStyle}>
                    <img src={`data:image/jpeg;base64,${doc.image}`} style={imgStyle} alt={doc.title} />
                    <Paragraph style={{ color: '#38385C', textAlign: 'center', marginRight: '16px', marginTop: '16px' }}>{doc.title}</Paragraph>
                  </div>
                ))}
              </Slider>
            ) : (
              <Paragraph style={{ color: '#38385C' }}>Chưa có tài liệu mới cập nhật</Paragraph>
            )}
            <div style={{ textAlign: 'right', marginRight: '16px', marginTop: '16px' }}>
              <Button onClick={() => handleNavigation('/documents')}>
                Xem thêm <DoubleRightOutlined />
              </Button>
            </div>
          </div>

          <div ref={khoaHocMoiRef} style={{ marginLeft: '16px' }}>
            <Title level={2} style={{ color: '#38385C' }}>Khóa học mới cập nhật</Title>
            <Paragraph style={{ color: '#38385C' }}>
              Dưới đây là các khóa học mới cập nhật...
            </Paragraph>
            {courses.length > 0 ? (
              <Slider {...getCarouselSettings(courses)}>
                {courses.map(course => (
                  <div key={course.id} style={itemStyle}>
                    <img src={`data:image/jpeg;base64,${course.image}`} style={imgStyle} alt={course.title} />
                    <Paragraph style={{ textAlign: 'center', marginRight: '16px', marginTop: '16px' }}>{course.title}</Paragraph>
                  </div>
                ))}
              </Slider>
            ) : (
              <Paragraph style={{ color: '#38385C' }}>Chưa có khóa học mới cập nhật</Paragraph>
            )}
            <div style={{ textAlign: 'right', marginRight: '16px', marginTop: '16px' }}>
              <Button onClick={() => handleNavigation('/courses')}>
                Xem thêm <DoubleRightOutlined />
              </Button>
            </div>
          </div>

          <div ref={phanMemMoiRef} style={{ marginTop: '24px', marginLeft: '16px' }}>
            <Title level={2} style={{ color: '#38385C' }}>Phần mềm mới cập nhật</Title>
            <Paragraph style={{ color: '#38385C' }}>
              Dưới đây là các phần mềm mới cập nhật...
            </Paragraph>
            {softwares.length > 0 ? (
              <Slider {...getCarouselSettings(softwares)}>
                {softwares.map(software => (
                  <div key={software.id} style={itemStyle}>
                    <img src={`data:image/jpeg;base64,${software.image}`} style={imgStyle} alt={software.title} />
                    <Paragraph style={{ textAlign: 'center', marginRight: '16px', marginTop: '16px' }}>{software.title}</Paragraph>
                  </div>
                ))}
              </Slider>
            ) : (
              <Paragraph style={{ color: '#38385C' }}>Chưa có phần mềm mới cập nhật</Paragraph>
            )}
            <div style={{ textAlign: 'right', marginRight: '16px', marginTop: '16px' }}>
              <Button onClick={() => handleNavigation('/software')}>
                Xem thêm <DoubleRightOutlined />
              </Button>
            </div>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', marginBottom: '0px' }}>
        <Paragraph>
          Hỗ trợ học tập ©2024. Tất cả các quyền được bảo lưu. Created by Vo Phu Thanh ^^
        </Paragraph>
      </Footer>

      <Modal
        title="Vui lòng đăng nhập hoặc đăng ký"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="login" type="primary" onClick={handleLogin}>
            Đăng nhập
          </Button>,
          <Button key="register" type="primary" onClick={handleRegister}>
            Đăng ký
          </Button>,
        ]}
      >
        <p>Bạn cần đăng nhập hoặc đăng ký tài khoản trước khi sử dụng ^^</p>
      </Modal>
    </Layout>
  );
};

export default Home;
