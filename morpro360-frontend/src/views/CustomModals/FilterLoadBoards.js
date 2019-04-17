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

export default class FilterLoadBoards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:"",
      loadDetails:"",
      minWeight:"",
      maxWeight:"",
      minRate:"",
      maxRate:"",
      minDistance:"",
      maxDistance:"",
      fromPickUpDate:"",
      toPickUpDate:"",
      fromDropOffDate:"",
      toDropOffDate:"",
      pickUpState:"",
      dropOffState:"",
      pickUpCity:"",
      dropOffCity:"",
      pickUpZipCode:"",
      dropOffZipCode:"",

      loading: false
    };

    this.userService = new UserService();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  render() {

    return (
      <div>
          <Row>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="name">Load Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Name of Load"
                  required
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="loadDetails">Load Details</Label>
                <Input
                  type="text"
                  id="loadDetails"
                  placeholder="Load Details"
                  name="loadDetails"
                  value={this.state.loadDetails}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
  
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="minWeight">Mimimum Weight</Label>
                <Input
                  type="number"
                  id="minWeight"
                  placeholder="Minimum Weight"
                  required
                  name="minWeight"
                  value={this.state.minWeight}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="maxWeight">Maximum Weight</Label>
                <Input
                  type="number"
                  id="maxWeight"
                  placeholder="Maximum Weight"
                  name="maxWeight"
                  value={this.state.maxWeight}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="minRate">Mimimum Rate</Label>
                <Input
                  type="number"
                  id="minRate"
                  placeholder="Minimum Rate"
                  required
                  name="minRate"
                  value={this.state.minRate}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="maxRate">Maximum Rate</Label>
                <Input
                  type="number"
                  id="maxRate"
                  placeholder="Maximum Rate"
                  name="maxRate"
                  value={this.state.maxRate}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="minDistance">Mimimum Distance</Label>
                <Input
                  type="number"
                  id="minDistance"
                  placeholder="Minimum Distance"
                  required
                  name="minDistance"
                  value={this.state.minDistance}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="maxDistance">Maximum Distance</Label>
                <Input
                  type="number"
                  id="maxDistance"
                  placeholder="Maximum Distance"
                  name="maxDistance"
                  value={this.state.maxDistance}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="fromPickUpDate">From Pick Up Date</Label>
                <Input
                  type="date"
                  id="fromPickUpDate"
                  name="fromPickUpDate"
                  value={this.state.fromPickUpDate}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="toPickUpDate">To Pick Up Date</Label>
                <Input
                  type="date"
                  id="toPickUpDate"
                  name="toPickUpDate"
                  value={this.state.toPickUpDate}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="fromDropOffDate">From Drop Off Date</Label>
                <Input
                  type="date"
                  id="fromDropOffDate"
                  name="fromDropOffDate"
                  value={this.state.fromDropOffDate}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="toDropOffDate">To Drop Off Date</Label>
                <Input
                  type="date"
                  id="toDropOffDate"
                  name="toDropOffDate"
                  value={this.state.toDropOffDate}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
          </Row>


          <Row>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="pickUpState">Pick Up State</Label>
                <Input
                  type="text"
                  id="pickUpState"
                  name="pickUpState"
                  value={this.state.pickUpState}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="dropOffState">Drop Off State</Label>
                <Input
                  type="text"
                  id="dropOffState"
                  name="dropOffState"
                  value={this.state.dropOffState}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="pickUpCity">Pick Up City</Label>
                <Input
                  type="text"
                  id="pickUpCity"
                  name="pickUpCity"
                  value={this.state.pickUpCity}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="dropOffCity">Drop Off City</Label>
                <Input
                  type="text"
                  id="dropOffCity"
                  name="dropOffCity"
                  value={this.state.dropOffCity}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="pickUpZipCode">Pick Up Zip Code</Label>
                <Input
                  type="text"
                  id="pickUpZipCode"
                  name="pickUpZipCode"
                  value={this.state.pickUpZipCode}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0">
              <FormGroup>
                <Label htmlFor="dropOffZipCode">Drop Off Zip Code</Label>
                <Input
                  type="text"
                  id="dropOffZipCode"
                  name="dropOffZipCode"
                  value={this.state.dropOffZipCode}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0"></Col>
            <Col col="6" sm="6" md="6" xl className="mb-3 mb-xl-0"></Col>
          </Row>

          <Button
            color="btn btn-danger"
            onClick={() => {
              this.props.toggleFilter();
            }}
            style={{margin:10,marginLeft:0,width:200}}
          >
            Close
          </Button>
          <Button
            color="success"
            onClick={e => {
              this.props.reloadAvailableLoads(this.state);
              // this.props.toggleFilter();
            }}
            style={{margin:10,marginLeft:0,width:200}}
          >
            {" "}
            Apply Filters
            </Button>
            <br/>
            <br/>
            </div>

    );
  }
}
