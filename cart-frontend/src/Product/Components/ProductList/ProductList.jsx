import {
  Button,
  Card,
  Col,
  Divider,
  Pagination,
  Row,
  Tooltip,
  Drawer,
  Spin,
  message,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import "./ProductsList.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const { Meta } = Card;

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]); // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false); // Toggle Cart Popup
  const [favorites, setFavorites] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5001/product/");
        const fakeImages = [
          "product.jpg",
          "product2.jpeg",
          "product9.jpg",
          "product9.jpg",
        ];
        const enhancedProducts = response.data.map((product) => ({
          ...product,
          image: fakeImages[Math.floor(Math.random() * fakeImages.length)], // Random image
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 - 5.0
          reviewsCount: Math.floor(Math.random() * 200) + 10, // Random reviews (10 - 200)
        }));

        setProducts(enhancedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to toggle favorite
  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === product.id)) {
        return prevFavorites.filter((fav) => fav.id !== product.id);
      } else {
        return [...prevFavorites, product];
      }
    });
  };

  const handleBuyNow = async () => {
    if (cart.length === 0) {
      return;
    }

  
    const requestBody = {
      products: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      total_price: cart.reduce(
        (acc, item) => acc + parseFloat(item.price) * item.quantity,
        0
      ),
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/cart/addItems",
        requestBody,
      );

      console.log("Purchase successful:", response.data);
      message.success("Products Added to cart successfully!");

      // Clear the cart after successful purchase
      setCart([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Purchase failed. Please try again.");
    }
  };

  // Handle Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Slice products for pagination
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Add item to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    setIsCartOpen(true); // Open the cart drawer
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) } // Prevent going below 1
          : item
      )
    );
  };

  // Remove item from cart and update state
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id)); // Remove item from cart
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <>
      <h2 className="section-title">Headphones For You!</h2>
      <Divider className="ant-divider-custom" />
      {isLoading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="productsList">
          <Row gutter={[16, 16]}>
            {paginatedProducts.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card
                  className="productCard"
                  cover={
                    <div className="product-image-container">
                      <img
                        className="productThumbnail"
                        src={product.image || "default-image.jpg"} // Fallback image
                        alt={product.name}
                      />
                      {/* Heart Icon for Favorites */}
                      <div
                        className="favorite-icon"
                        onClick={() => toggleFavorite(product)}
                      >
                        {favorites.some((fav) => fav.id === product.id) ? (
                          <HeartFilled style={{ color: "red" }} />
                        ) : (
                          <HeartOutlined />
                        )}
                      </div>
                    </div>
                  }
                >
                  <div className="product-card-meta">
                    <Tooltip title={product.name} arrow={false}>
                      <h3 className="product-title">{product.name}</h3>
                    </Tooltip>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>

                    {/* Display fake rating and number of reviews */}
                    <div className="product-rating">
                      ⭐ {product.rating} ({product.reviewsCount} reviews)
                    </div>
                  </div>

                  <Button
                    className="add-to-cart"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <div className="paginationBar">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          className="docList"
          total={products.length}
          onChange={handlePageChange}
        />
      </div>

      {/* Cart Drawer */}
      <Drawer
        title={
          <span>
            <ShoppingCartOutlined /> Your Cart
          </span>
        }
        placement="right"
        closable={true}
        onClose={() => setIsCartOpen(false)}
        open={isCartOpen}
        width={350}
      >
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image || "default-image.jpg"}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>${parseFloat(item.price).toFixed(2)}</p>
                  <div className="cart-actions">
                    <div className="cart-quantity">
                      <Button
                        icon={<MinusOutlined />}
                        onClick={() => decreaseQuantity(item.id)}
                      />
                      <span>{item.quantity}</span>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => increaseQuantity(item.id)}
                      />
                    </div>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      className="delete-btn"
                      onClick={() => removeFromCart(item.id)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Total Price Display */}
            <div className="cart-total">
              <h3>Total Price:</h3>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {/* Buy Now Button */}
            <Button
              className="buy-now-btn"
              type="primary"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
};

export default ProductsList;
