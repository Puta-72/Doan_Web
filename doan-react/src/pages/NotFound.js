import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
        extra={
          <Button type="primary" onClick={handleBackHome}>
            Trở về trang chính
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
