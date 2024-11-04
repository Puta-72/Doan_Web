package com.doan.controllers;

import com.doan.entities.CartItem;
import com.doan.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // danh sách các sản phẩm trong cảt
    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        List<CartItem> cartItems = cartService.getCartItems();
        return ResponseEntity.status(HttpStatus.OK).body(cartItems);
    }

    // thêm vào cảt
    @PostMapping
    public ResponseEntity<List<CartItem>> addToCart(@RequestBody CartItem cartItem) {
        cartService.addToCart(cartItem);
        List<CartItem> cartItems = cartService.getCartItems();
        return ResponseEntity.status(HttpStatus.OK).body(cartItems);
    }

    // Xóa khỏi cart
    @DeleteMapping("/{id}")
    public ResponseEntity<List<CartItem>> deleteFromCart(@PathVariable Long id) {
        cartService.deleteCartItem(id);
        List<CartItem> cartItems = cartService.getCartItems();
        return ResponseEntity.status(HttpStatus.OK).body(cartItems);
    }

    // Thanh toán
    @PostMapping("/checkout")
    public ResponseEntity<String> checkoutCart() {
        cartService.checkout();
        return ResponseEntity.status(HttpStatus.OK).body("Thanh toán thành công");
    }
}
