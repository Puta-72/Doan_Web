import React from 'react';
import { Layout, List, Button, message } from 'antd';
import { useCart } from '../providers/CartProvider';
import { useAuth } from '../providers/AuthProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';

const { Content } = Layout;

const Cart = () => {
  const { cart, removeFromCart, checkout } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      message.error('Vui lòng đăng nhập để thực hiện thanh toán.');
      return;
    }

    checkout();
    message.success('Thanh toán thành công');
  };

  // Tính tổng giá trị giỏ hàng
  const totalAmount = cart.reduce((total, course) => {
    return total + (course.price || 0);
  }, 0);

  return (
    <Layout>
      <Header title="Giỏ hàng" />
      <Content className="layouts-container">
        {cart.length > 0 ? (
          <>
            <List
              itemLayout="horizontal"
              dataSource={cart}
              renderItem={(course) => (
                <List.Item
                  key={course.id}
                  actions={[
                    <Button onClick={() => removeFromCart(course.id)}>Xóa</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={course.courseTitle || course.title || 'Không có tiêu đề'}
                    description={`Giá: ${course.price != null ? course.price.toLocaleString('vi-VN') : '0'} VND`}
                  />
                </List.Item>
              )}
            />
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <h3>Tổng giá: {totalAmount.toLocaleString('vi-VN')} VND</h3>
            </div>
            <Button type="primary" onClick={handleCheckout} disabled={cart.length === 0}>
              Thanh toán
            </Button>
          </>
        ) : (
          <p>Giỏ hàng của bạn trống.</p>
        )}
      </Content>
      <Footer />
    </Layout>
  );
};

export default Cart;
