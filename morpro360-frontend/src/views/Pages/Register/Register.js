import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

import { createUser } from "../../../ApiCalls/user";
import validateInput from "../../../validation/input";

import userService from "../../../services/User";
import { STATUS_CODES } from "http";
import DangerModal from "../../CustomModals/DangerModal";
import { stat } from "fs";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      userName: "",
      firstName: "",
      lastName: "",
      password: "",
      repeatPassword: "",
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

    if (this.state.password !== this.state.repeatPassword) {
      const errormessage = "Password and repeated password are not same";
      this.setState({ modalErrors: errormessage });
      this.toggleModal();

      return;
    }

    const stateData = Object.assign({}, this.state);

    delete stateData.repeatPassword;
    delete stateData.isVisible;
    delete stateData.modalErrors;
 

    const validationErrors = validateInput(stateData, [
      "email",
      "userName",
      "password"
    ]);

    if (validationErrors) {
      const errormessage = validationErrors.join("\n");
      this.setState({ modalErrors: errormessage });
      this.toggleModal();

      return;
    }

    console.log(this.state);
    try {
      const response = await createUser(stateData);
      console.log(response);
      const data = response.data;
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
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="First Name"
                        autoComplete="firstName"
                        name="firstName"
                        value={this.state.firstName}
                        onChange={this.handleChange}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        autoComplete="lastName"
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.handleChange}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        name="userName"
                        value={this.state.userName}
                        onChange={this.handleChange}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
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

                    <InputGroup className="mb-3">
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

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="password"
                        name="repeatPassword"
                        value={this.state.repeatPassword}
                        onChange={this.handleChange}
                      />
                    </InputGroup>

                    <Button color="success" block onClick={this.handleSubmit}>
                      Create Account
                    </Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="12">
                      <Button className="btn-google-plus mb-1" block>
                        <i className="fa fa-google-plus" />
                        <span> Login With gmail</span>
                      </Button>
                    </Col>
                    {/* <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block>
                        <span>twitter</span>
                      </Button>
                    </Col> */}
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
