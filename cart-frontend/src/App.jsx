import React, { useState } from "react";
import "./App.css";
import MainContent from "./layout/components/MainContent/MainContent";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Authentication/Components/Login/Login";
import ProductsList from "./Product/Components/ProductList/ProductList";
import CartList from "./Cart/Components/CartList/CartList";
import axios from "axios";
import { Spin } from "antd";

const App = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Axios Interceptors to Attach Token to Every Request
  axios.interceptors.request.use(
    (config) => {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      setIsLoading(false);
      return response;
    },
    async (error) => {
      console.error(error.response?.data || "Request failed");
      if (error.response?.data?.detail === "Invalid access token") {
        handleClearStorage();
      }
      setIsLoading(false);
      return Promise.reject(error);
    }
  );

  // Clears Storage and Redirects to Login on Token Expiry
  const handleClearStorage = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {isLoading && <Spin fullscreen={true} size="large"></Spin>}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainContent />}>
          <Route path="products" element={<ProductsList />} />
          <Route path="/cart" element={<CartList />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

