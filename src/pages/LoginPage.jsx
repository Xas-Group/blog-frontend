import React, { useState } from "react";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import Joi from "joi";
import axiosInstance from "../utils/axiosInstance";
import AuthService from "../services/authService"; // Ensure correct import
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import sweetalert2

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: linear-gradient(to right, #f8f9fa, #e9ecef);
`;

const LoginCard = styled.div`
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  width: 400px;
`;

const IconWrapper = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
`;

const StyledFeedback = styled(Form.Control.Feedback)`
  width: 100%;
  min-height: 1.5em;
`;

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const schema = Joi.object({
    username: Joi.string().min(3).max(70).required().label("Username"),
    password: Joi.string().min(6).required().label("Password"),
  });

  const validateField = (name, value) => {
    const fieldSchema = Joi.object({ [name]: schema.extract(name) });
    const { error } = fieldSchema.validate({ [name]: value });
    return error ? error.details[0].message : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (!error) return null;

    const errorObj = {};
    error.details.forEach((detail) => {
      errorObj[detail.path[0]] = detail.message;
    });

    return errorObj;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateForm();
  if (validationErrors) {
    setErrors(validationErrors);
    setTouched({ username: true, password: true });
    return;
  }

  try {
    setLoading(true);

    // Determine endpoint based on role
    const endpoint = role === "admin" ? "/super-admin/login" : "/reader/login";
    const response = await axiosInstance.post(endpoint, formData);

    // Check if the response contains the necessary data
    if (response.data) {
      const { superAdmin, apiKey } = response.data;

      if (superAdmin) {
        // Set user info using AuthService
        AuthService.setUserInfo(superAdmin, apiKey);

        // Redirect based on the type of user
        if (superAdmin.type === "admin") {
          navigate("/dashboard");
        } else {
          throw new Error("Unexpected user type"); // Handle unexpected types
        }
      } else {
        throw new Error("Invalid response structure");
      }
    } else {
      throw new Error("Invalid response");
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Incorrect username or password. Please try again.",
      confirmButtonText: "OK",
    });

    setErrors({
      general: "Login failed. Please check your credentials and try again.",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <CenteredContainer>
      <LoginCard>
        <h3 className="mb-4">Login</h3>
        {errors.general && (
          <p style={{ color: "red", fontWeight: "bold" }}>{errors.general}</p>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.username}
            />
            <StyledFeedback type="invalid">{errors.username}</StyledFeedback>
          </Form.Group>

          <Form.Group
            controlId="formPassword"
            className="mt-3"
            style={{ position: "relative" }}
          >
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.password}
              />
              <IconWrapper
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </IconWrapper>
              <StyledFeedback type="invalid">{errors.password}</StyledFeedback>
            </InputGroup>
          </Form.Group>

          <Form.Group as={Row} controlId="roleSelection" className="mt-3">
            <Col sm="9">
              <Form.Check
                inline
                type="radio"
                label="Admin"
                value="admin"
                name="role"
                checked={role === "admin"}
                onChange={handleRoleChange}
                aria-label="Admin role"
              />
              <Form.Check
                inline
                type="radio"
                label="Reader"
                value="reader"
                name="role"
                checked={role === "reader"}
                onChange={handleRoleChange}
                aria-label="Reader role"
              />
            </Col>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="mt-4"
            fullWidth
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </LoginCard>
    </CenteredContainer>
  );
}

export default LoginPage;
