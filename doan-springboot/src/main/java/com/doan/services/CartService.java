package com.doan.services;

import com.doan.entities.CartItem;
import com.doan.repositories.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // tất cả sản phẩm trong cart
    public List<CartItem> getCartItems() {
        List<CartItem> items = cartRepository.findAll();
        items.forEach(item -> {
            if (item.getPrice() == null) {
                item.setPrice(0.0);
            }
            if (item.getCourseTitle() == null) {
                item.setCourseTitle("Không xác định");
            }
        });
        return items;
    }

    // Thêm khóa học cart
    public void addToCart(CartItem cartItem) {
        CartItem existingCartItem = cartRepository.findByCourseTitleAndBuyer(cartItem.getCourseTitle(), cartItem.getBuyer());

        if (existingCartItem != null) {
            throw new IllegalArgumentException("Khóa học đã có trong giỏ hàng.");
        } else {
            cartItem.setAddedDate(LocalDateTime.now());
            cartRepository.save(cartItem);
        }
    }

    // Xóa khỏi giỏ hàng
    public void deleteCartItem(Long id) {
        cartRepository.deleteById(id);
    }

    // Thanh toán cart
    public void checkout() {
        List<CartItem> cartItems = cartRepository.findAll();

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng trống. Không thể thanh toán.");
        }

        // Sau khi thanh toán thành công, xóa cart
        cartRepository.deleteAll();
    }
}
