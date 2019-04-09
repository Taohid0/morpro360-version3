import React, { Component } from "react";
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row
} from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import UserService from "../../../services/User";
import validateInput from "../../../validation/input";
import { createAdmin } from "../../../ApiCalls/admin";
import { getRoles } from "../../../ApiCalls/role";
import DangerModal from "../../CustomModals/DangerModal";
import SuccessModal from "../../CustomModals/SuccessModal";

export default class AddAdminForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      RoleId: "",
      password: "",
      repeatPassword: "",
      isErrorModalVisible: false,
      modalErrorMessage: "",
      isSuccessModalVisible: false,
      successModalTitle: "Sucessful",
      modalSuccessMessage: "",
      roleDropdown: [],
      loading:false,
    };
    this.userService = new UserService();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleDangerModal = this.toggleDangerModal.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
    this.loadRoles = this.loadRoles.bind(this);
  }

  componentWillMount() {
    this.loadRoles();
  }
  async loadRoles() {
    const promise = await getRoles();
    const data = promise.data.data;
    const roles = data.map(role => {
      return (
        <option key={role.id} value={role.id}>
          {role.name}
        </option>
      );
    });

    if (data.length > 0) {
      this.setState({ RoleId: data[0].id });
    }

    this.setState({ roleDropdown: roles });
  }

  toggleDangerModal() {
    this.setState((state, props) => ({
      isErrorModalVisible: !state.isErrorModalVisible
    }));
  }
  toggleSuccessModal() {
    this.setState((state, props) => ({
      isSuccessModalVisible: !state.isSuccessModalVisible
    }));
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  async handleSubmit(e) {
    e.preventDefault();

    const {
      isErrorModalVisible,
      modalErrorMessage,
      isSuccessModalVisible,
      modalSuccessMessage,
      successModalTitle,
      roleDropdown,
      repeatPassword,
      loading,
      ...stateData
    } = this.state;
    const validationErrors = validateInput(stateData, [
      "firstName",
      "lastName",
      "email",
      "phone",
      "password"
    ]);

    if (validationErrors) {
      const errormessage = validationErrors.join("\n");
      this.setState({ modalErrorMessage: errormessage });
      this.toggleDangerModal();

      return;
    }
    if (this.state.password !== this.state.repeatPassword) {
      const errormessage = "Password and reapeated password mismatched";
      this.setState({ modalErrorMessage: errormessage });
      this.toggleDangerModal();
      return;
    }

    try {
      this.setState({loading:true});
      const response = await createAdmin(stateData);
      const data = response.data;
      if (data.status) {
        const modalSuccessMessage = "Successfully new admin added";
        this.setState({ modalSuccessMessage });
        this.toggleSuccessModal();
      } else {
        const errormessage = data.errors.join("\n");
        this.setState({ modalErrorMessage: errormessage });
        this.toggleDangerModal();
      }
    } catch (err) {
      console.log(err);
      const response = err.response;
      if (response && response.status === 401) {
        const errorMessage = "Session expired, please login to continue";
        alert(errorMessage);
        this.userService.clearData();
        this.props.history.push("/login");
      } else {
        const errormessage = "Something wrong, please try again later";
        this.setState({ modalErrorMessage: errormessage });
        this.toggleDangerModal();
      }
    }
    this.setState({loading:false});
  }
  render() {
    return (
      <div>
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
        <DangerModal
          isVisible={this.state.isErrorModalVisible}
          errors={this.state.modalErrorMessage}
          toggleModal={this.toggleDangerModal}
        />
        <SuccessModal
          isVisible={this.state.isSuccessModalVisible}
          errors={this.state.modalSuccessMessage}
          toggleModal={this.toggleSuccessModal}
          title={this.state.successModalTitle}
          goToDashboard={() => this.props.history.push("/dashboard")}
        />
        <Card>
          <CardHeader>
            <strong>Admin</strong>
            <small> Form</small>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="Enter first name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    placeholder="Enter last name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    type="phone"
                    id="phone"
                    placeholder="xxxxxxxxx"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="myawesomemail@mymail.com"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label htmlFor="RoleId">Select Role</Label>
              <Input
                type="select"
                name="RoleId"
                id="RoleId"
                value={this.state.RoleId}
                onChange={this.handleChange}
              >
                {this.state.roleDropdown}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">New Admin's Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="This admin will use this password for logging in to his account"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="license">Repeat Password</Label>
              <Input
                type="password"
                id="repeatPassword"
                placeholder="Repeat admin's password"
                name="repeatPassword"
                value={this.state.repeatPassword}
                onChange={this.handleChange}
              />
            </FormGroup>

            {/* <FormGroup>
                <Label htmlFor="companyId">Select Company</Label>
                <Input type="select" name="companyId" id="companyId" value={this.state.companyId} onChange={this.handleChange}>
                   {this.state.companyDropdown}
                </Input>
              </FormGroup> */}
          </CardBody>

          {/* <Row className="align-items-right">
              <Col  md="3" xs="1" className="">
                <Button block color="success">Success</Button>
              </Col>
            </Row> */}

          <Button
            onClick={this.handleSubmit}
            className="btn btn-success col-6 align-self-center"
          >
            <i className="fa fa-dot-circle-o" /> Create Admin
          </Button>
          <br />
          <br />
        </Card>
      </div>
    );
  }
}
