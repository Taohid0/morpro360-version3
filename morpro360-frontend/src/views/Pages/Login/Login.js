import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

import { login } from "../../../ApiCalls/auth";
import validateInput from "../../../validation/input";
import DangerModal from "../../CustomModals/DangerModal";
import userService from "../../../services/User";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isVisible: false,
      modalErrors: ""
    };

    this.userService = new userService();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  toggleModal() {
    this.setState((state, props) => ({
      isVisible: !state.isVisible
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateInput(this.state, ["email", "password"]);

    if (validationErrors) {
      const errormessage = validationErrors.join("\n");
      this.setState({ modalErrors: errormessage });
      this.toggleModal();
      return;
    }

    try {
      const response = await login(this.state);
      const data = response.data;
      console.log(data);
      if (data.status) {
        const status = this.userService.storeUser(data.data);
        if (!status) {
          const errormessage = "Something wrong, please try again later";
          this.setState({ modalErrors: errormessage });
          this.toggleModal();
        }
      } else {
        const errormessage = data.errors.join("\n");
        this.setState({ modalErrors: errormessage });
        this.toggleModal();
      }
    } catch (err) {
      const errormessage = "Something wrong, please try again later";
      this.setState({ modalErrors: errormessage });
      this.toggleModal();
      console.log(err);
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
         <DangerModal
          isVisible={this.state.isVisible}
          errors={this.state.modalErrors}
          toggleModal={this.toggleModal}
        />
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Email"
                          autoComplete="email"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleChange}
                        />
                      </InputGroup>

                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="password"
                          name="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                        />
                      </InputGroup>

                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            onClick={this.handleSubmit}
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua.
                      </p>
                      <Link to="/register">
                        <Button
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
