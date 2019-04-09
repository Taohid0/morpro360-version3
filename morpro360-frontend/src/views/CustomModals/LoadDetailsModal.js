import React, { Component } from "react";

import {
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Badge,
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

import validateInput from "../../validation/input";
import { createBid } from "../../ApiCalls/bid";
import { getCompanyDrivers } from "../../ApiCalls/driver";
import LoadingOverlay from "react-loading-overlay";
import UserService from "../../services/User";
import { timingSafeEqual } from "crypto";

import SuccessModal from "./SuccessModal";

export default class LoadDetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBidPressed: false,
      rate: "",
      driverDropdown: [],
      note: "",
      driverId: "",
      errors: "",
      isSuccessModalVisible: false,
      successModalTitle: "Sucessful",
      modalSuccessMessage: "",
      loading: false
    };

    this.userService = new UserService();

    this.allCompanies = [];
    this.allDrivers = [];
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showBiddingFields = this.showBiddingFields.bind(this);
    this.fillUpDrivers = this.fillUpDrivers.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
  }
  //this.props.goToDashboard();
  //this will be added later

  componentWillMount() {
    this.fillUpDrivers();
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
      isSuccessModalVisible,
      modalSuccessMessage,
      successModalTitle,
      isBidPressed,
      driverDropdown,
      errors,
      loading,
      ...stateData
    } = this.state;
    stateData.loadId = this.props.loadId;
    const validationErrors = validateInput(stateData, [
      "rate",
      "driverId",
      "loadId"
    ]);
    console.log(stateData);
    if (validationErrors) {
      const errormessage = validationErrors.join("\n");
      this.setState({ errors: errormessage });
      // this.toggleDangerModal();
      return;
    }

    try {
      this.setState({ loading: true });
      const response = await createBid(stateData);
      this.setState({ loading: false });
      const data = response.data;
      if (data.status) {
        this.props.toggleModal();
        const modalSuccessMessage = "Successfully your bid placed";
        this.setState({
          modalSuccessMessage,
          rate: "",
          errors: "",
          isBidPressed: false
        });
        // this.toggleSuccessModal();
        alert(this.state.modalSuccessMessage);
        this.props.reloadAvailableLoads();
      } else {
        const errormessage = data.errors.join("\n");
        this.setState({ errors: errormessage });
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
        this.setState({ errors: errormessage });
        this.toggleDangerModal();
      }
    }
  }

  async fillUpDrivers() {
    this.setState({ loading: true });
    const user = await this.userService.getUser();
    const promise = await getCompanyDrivers(user.id);
    this.setState({ loading: false });
    const data = promise.data.data;

    const tempDrivers = [];

    for (let driver of data) {
      tempDrivers.push(
        <option key={driver.id} value={driver.id}>
          {driver.name} ({driver.license})
        </option>
      );
    }
    if (tempDrivers.length > 0) {
      this.setState({ driverDropdown: tempDrivers, driverId: data[0].id });
    }

    // const driverPromise = await getCompanyDrivers(data[0].id);
    // console.log(driverPromise);
  }

  showBiddingFields() {
    if (this.state.isBidPressed) {
      return (
        <Card>
          <CardHeader>
            <strong>Bidding</strong>
            <small> Form</small>
          </CardHeader>
          <CardBody>
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
            <pre>
              <h4 className="text-danger">{this.state.errors}</h4>
            </pre>
            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="rate">Your proposed rate</Label>
                  <Input
                    type="number"
                    id="rate"
                    placeholder="Enter you rate"
                    required
                    name="rate"
                    value={this.state.rate}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="driverId">Select Driver</Label>
                  <Input
                    type="select"
                    name="driverId"
                    id="driverId"
                    value={this.state.driverId}
                    onChange={this.handleChange}
                  >
                    {this.state.driverDropdown}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="note">Enter additional note (optional)</Label>
                  <Input
                    type="textarea"
                    id="note"
                    placeholder="Enter additional note (optional)"
                    required
                    name="note"
                    value={this.state.note}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    }
    return "";
  }

  render() {
    const load = this.props.loadDetails;
    return (
      <Modal
        isOpen={this.props.isVisible}
        toggle={this.toggleSuccess}
        className={"modal-lg " + this.props.className}
      >
        {/* <SuccessModal
          isVisible={this.state.isSuccessModalVisible}
          errors={this.state.modalSuccessMessage}
          toggleModal={this.toggleSuccessModal}
          title={this.state.successModalTitle}
          goToDashboard={() => this.props.history.push("/dashboard")}
        /> */}
        <ModalHeader toggle={this.toggleSuccess}>{load.name}</ModalHeader>
        <ModalBody>
          <pre>
            Product : {load.productDetails}
            <br />
            Weight : {load.weight} lb
            <br />
            Distance :{load.distance} Miles
            <br />
            Proposed Rate : ${load.rate}
            <br />
            <br />
            Pick Up State : {load.pickUpState}
            <br />
            Pick Up City : {load.pickUpCity}
            <br />
            Pick Up Zip Code : {load.pickUpZipCode}
            <br />
            Pick Up Date : {load.pickUpDate}
            <br />
            <br />
            Drop Off State : {load.dropOffState}
            <br />
            Drop Off City : {load.dropOffCity}
            <br />
            Drop Off Zip Code : {load.dropOffZipCode}
            <br />
            Drop Off Date : {load.dropOffDate}
            <br />
          </pre>
          <br />
          {this.showBiddingFields()}
        </ModalBody>
        <ModalFooter>
          <Button
            color="btn btn-danger"
            onClick={() => {
              this.props.toggleModal();
              this.setState({
                isBidPressed: false
              });
            }}
          >
            Close
          </Button>
          {!this.state.isBidPressed ? (
            <Button
              color="success"
              onClick={e => {
                this.setState({
                  isBidPressed: true
                });
              }}
            >
              {" "}
              Bid on this load
            </Button>
          ) : (
            <Button
              color="success"
              onClick={e => {
                this.handleSubmit(e);
              }}
            >
              Confirm Bid
            </Button>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}
