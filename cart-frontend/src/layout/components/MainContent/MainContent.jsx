import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import NavBar from "../NavBar/NavBar";
import { Footer } from "antd/es/layout/layout";
const { Content } = Layout;
const MainContent = () => {
  return (
    <Layout>
      <Sidebar />
      <Layout>
        <NavBar />
        <Content>
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          <div className="footer">
            <img className="authorLogo" src="/grocery-cart.png" alt="" />
            All rights reserved © 2025
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainContent;
