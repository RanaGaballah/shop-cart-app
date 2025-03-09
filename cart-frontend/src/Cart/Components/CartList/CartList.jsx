import React, { useEffect, useState } from "react";
import "./CartList.css";
import {Spin } from "antd";
import axios from "axios";

const CartList = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5001/cart/getItems");
        setCartItems(response.data.cartItems);
        setTotalCartPrice(response.data.totalCartPrice);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {loading ? (
        <Spin size="large" />
      ) : cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>${parseFloat(item.total_price).toFixed(2)}</p>
              </div>
              <div className="cart-item-actions">
                <span className="cart-quantity">Qty: {item.quantity}</span>
              </div>
            </div>
          ))}

          {/* Total Price Display */}
          <div className="cart-total">
            <h3>Total Price:</h3>
            <span>${parseFloat(totalCartPrice).toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default CartList;
