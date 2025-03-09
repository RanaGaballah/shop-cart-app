import React, { useState } from "react";
import "./NavBar.css";
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
// } from "@ant-design/icons";
import { Layout, Button, Dropdown } from "antd";
const { Header } = Layout;

const NavBar = () => {
  return (
    <Header>
      <div></div>
      <span className="btns-holder">
        <Button className="userBtn">
          <img className="cart" src="/icons/cart.svg" alt="" />
        </Button>
        <Button className="userBtn">
          <img className="user" src="/user.png" alt="" />
        </Button>
      </span>
    </Header>
  );
};
export default NavBar;
