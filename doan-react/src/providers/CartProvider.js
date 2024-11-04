import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart, addToCart, removeFromCart, checkoutCart } from '../api';
import { useAuth } from './AuthProvider';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetchCart();
        console.log('Dữ liệu giỏ hàng:', response.data);
        setCart(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    loadCart();
  }, []);

  const addToCartHandler = async (course) => {
    const existingItem = cart.find(item => item.course && item.course.id === course.id);

    if (existingItem) {
      alert("Khóa học đã tồn tại trong giỏ hàng.");
      return;
    }

    try {
      const payload = {
        courseId: course.id,
        courseTitle: course.title,
        price: course.price,
        buyer: user?.fullName, // Thêm thông tin người mua (tên user)
        userId: user?.id       // Thêm ID người dùng
      };

      const response = await addToCart(payload);
      setCart(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
    }
  };

  const removeFromCartHandler = async (courseId) => {
    try {
      const response = await removeFromCart(courseId);
      setCart(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert("Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.");
    }
  };

  const checkoutHandler = async () => {
    try {
      if (cart.length === 0) {
        alert("Giỏ hàng trống. Vui lòng thêm khóa học trước khi thanh toán.");
        return;
      }

      const response = await checkoutCart();
      setTransactions([...transactions, response.data || {}]);
      setCart([]);
      alert("Thanh toán thành công!");
    } catch (error) {
      console.error('Error during checkout:', error);
      alert("Thanh toán thất bại!");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: addToCartHandler,
        removeFromCart: removeFromCartHandler,
        checkout: checkoutHandler,
        transactions,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
