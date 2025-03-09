import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { Layout, Menu, Badge } from "antd";
import { Divider } from "antd";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedGeneralKey, setSelectedGeneralKey] = useState(null);
  const [selectedMainKey, setSelectedMainKey] = useState(location.pathname);
  // Menu item
  const mainItems = [
    {
      key: "/products",
      icon: <img src="/icons/headphons.svg"></img>,
      label: <Link to="/products">Products</Link>,
    },
  ];
  const generalItems = [
    {
      key: "/Cart",
      icon: <img src="/icons/cart.svg"></img>,
      label: <Link to="/Cart">Cart</Link>,
    },
    
  ];
  const selectOnMainList = (key) => {
    setSelectedGeneralKey(null);
  };
  const selectOnGeneralList = (key) => {
    setSelectedMainKey(null);
  };
  const logout = () => {
    handleClearStorage();
    navigate("/login");
  };

  const handleClearStorage = () => {
    
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <img className="logo" src="/logo.png" alt="" />
      <span className="menuTitle">General</span>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[selectedMainKey]}
        onClick={({ key }) => {
          selectOnMainList(key);
        }}
        items={mainItems.map((item) => ({
          ...item,
          onClick: () => setSelectedMainKey(item.key), // Set selected key on click
        }))}
      />
      <span className="menuTitle">Shop Cart</span>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedGeneralKey]}
        onClick={({ key }) => {
          selectOnGeneralList(key);
        }}
        items={generalItems.map((item) => ({
          ...item,
          onClick: () => setSelectedGeneralKey(item.key), // Set selected key on click
        }))}
      />
      <span className="logout">
        <Divider />
        <Menu
          theme="light"
          mode="inline"
          items={[
            {
              key: "1",
              icon: <img src="/icons/logout.svg"></img>,
              label: <span onClick={logout}>Log out</span>,
            },
          ]}
        />
      </span>
    </Sider>
  );
};
export default Sidebar;
