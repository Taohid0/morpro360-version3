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
import LoadingOverlay from "react-loading-overlay";
import { createUser } from "../../../ApiCalls/user";
import validateInput from "../../../validation/input";

import UserService from "../../../services/User";
import { STATUS_CODES } from "http";
import DangerModal from "../../CustomModals/DangerModal";
import { stat } from "fs";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "name":"",
      email: "",
      phone: "",
      MC:"",
      DOT:"",
      state:"",
      city:"",
      address:"",
      description:"",
      password: "",
      repeatPassword: "",
      isVisible: false,
      modalErrors: "",
      loading:false,
    };

    this.userService = new UserService();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.loadUserAndRedirect = this.loadUserAndRedirect.bind(this);
  }

  componentWillMount() {
    this.loadUserAndRedirect();
  }
  async loadUserAndRedirect()
  {
    const user = await this.userService.getUser();

    if(user)
    {
      this.props.history.push("/dashboard");
    }
    
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
    delete stateData.loading;

    const validationErrors = validateInput(stateData, [
      "name",
      "email",
      "phone",
      "MC",
      "DOT",
      "state",
      "city",
      "address",
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
      this.setState({loading:true});
      const response = await createUser(stateData);
      console.log(response);
      const data = response.data;
      if (data.status) {
        const status = await this.userService.storeUser(data.data);
        if (!status) {
          const errormessage = "Something wrong, please try again later";
          this.setState({ modalErrors: errormessage });
          this.toggleModal();
          return;
        }
        this.props.history.push("/dashboard");
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
    this.setState({loading:false});
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
        <LoadingOverlay
          active={this.state.loading}
          styles={{
            spinner: base => ({
              ...base,
              width: "250px",
              background: "rgba(0, 0, 0, 0.2)"
            })
          }}
          spinner
          text=""
        />
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
                          <i className="fa fa-institution" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Enter Company Name"
                        autoComplete="name"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="email"
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
                          <i className="fa fa-mobile-phone" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Enter Phone Number"
                        autoComplete="phone"
                        name="phone"
                        value={this.state.phone}
                        onChange={this.handleChange}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-drivers-license-o" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="number"
                        placeholder="Enter MC Number"
                        autoComplete="MC"
                        name="MC"
                        value={this.state.MC}
                        onChange={this.handleChange}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-drivers-license" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="number"
                        placeholder="Enter DOT Number"
                        autoComplete="DOT"
                        name="DOT"
                        value={this.state.DOT}
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-home" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Enter state name"
                        autoComplete="state"
                        name="state"
                        value={this.state.state}
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-home" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Enter city name"
                        autoComplete="city"
                        name="city"
                        value={this.state.city}
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-home" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="textarea"
                        placeholder="Enter company address"
                        autoComplete="address"
                        name="address"
                        value={this.state.address}
                        onChange={this.handleChange}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-file-text" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="textarea"
                        placeholder="Company Description (optional)"
                        autoComplete="description"
                        name="description"
                        value={this.state.description}
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
                    {/* <Col xs="12" sm="12">
                      <Button className="btn-google-plus mb-1" block>
                        <i className="fa fa-google-plus" />
                        <span> Login With gmail</span>
                      </Button>
                    </Col> */}
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
