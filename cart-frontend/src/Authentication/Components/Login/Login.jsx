import { useState } from "react";
import "./Login.css";
import { Button, Input, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/Auth/login", data);
      
      
      if (response.data?.token) {
        localStorage.setItem("accessToken", response.data.token);
        message.success("User Loged in successfully!");
        navigate("/products");
      } else {
        message.error("Login failed. No token received.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      {/* Left Side: Login Form */}
      <div className="authForm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="authTxt">
            <span className="authWelcomeMsg">Get Started</span>
            <span className="authWelcomeDesc">
              Welcome to <span className="brandColor">Shop Cart</span>. Login Now
            </span>
          </div>

          {/* Username Input */}
          <div className="inputGroup authInput">
            <label>Username</label>
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Username is required",
                maxLength: {
                  value: 64,
                  message: "Username must be at most 64 characters",
                },
              }}
              render={({ field }) => (
                <>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter Username"
                    {...field}
                  />
                  {dirtyFields.username && errors.username && (
                    <div className="error">{errors.username.message}</div>
                  )}
                </>
              )}
            />
          </div>

          {/* Password Input */}
          <div className="inputGroup authInput">
            <label>Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 32,
                  message: "Password must be at most 32 characters",
                },
              }}
              render={({ field }) => (
                <>
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter Password"
                    {...field}
                  />
                  {dirtyFields.password && errors.password && (
                    <div className="error">{errors.password.message}</div>
                  )}
                </>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            className="authBtn"
            shape="round"
            htmlType="submit"
            disabled={!isValid || loading}
            loading={loading}
          >
            Login
          </Button>
        </form>
      </div>

      {/* Right Side: Branding & Info */}
      <div className="authInfo">
        <img
          className="robotChatImg"
          src="/grocery-cart.png"
          alt="Shopping Cart"
        />
      </div>
    </div>
  );
};

export default Login;
