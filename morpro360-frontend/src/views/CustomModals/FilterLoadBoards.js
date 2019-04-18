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
      name: "",
      loadDetails: "",
      minWeight: "",
      maxWeight: "",
      minRate: "",
      maxRate: "",
      minDistance: "",
      maxDistance: "",
      fromPickUpDate: "",
      toPickUpDate: "",
      fromDropOffDate: "",
      toDropOffDate: "",
      pickUpState: "",
      dropOffState: "",
      pickUpCity: "",
      dropOffCity: "",
      pickUpZipCode: "",
      dropOffZipCode: "",
      isAdditionalFiltersVisible: false,

      loading: false
    };

    this.userService = new UserService();

    this.handleChange = this.handleChange.bind(this);
    this.renderAdditionalFilters = this.renderAdditionalFilters.bind(this);
    this.toggleAdditionalFilters = this.toggleAdditionalFilters.bind(this);
  }

  componentWillMount() {
  }
  toggleSuccessModal() {
    this.setState((state, props) => ({
      isSuccessModalVisible: !state.isSuccessModalVisible
    }));
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  toggleAdditionalFilters() {
    this.setState((state, props) => ({
      isAdditionalFiltersVisible: !state.isAdditionalFiltersVisible
    }));
  }
  renderAdditionalFilters() {
    const view = <Row>
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
    </Row>;

    if (this.state.isAdditionalFiltersVisible) {
      return view;
    }
    return "";
  }

  render() {

    return (
      <div>
        <Row>

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

        {this.renderAdditionalFilters()}

        <Row>
          <Col align="center">
            <Button
              color="success"
              onClick={e => {
                this.props.reloadAvailableLoads(this.state);
                // this.props.toggleFilter();
              }}
              style={{ margin: 10, marginLeft: 0, width: 200 }}
            >
              {" "}
              Apply Filters
            </Button>

            <Button
              color="btn btn-danger"
              onClick={() => {
                this.props.toggleFilter();
              }}
              style={{ margin: 10, marginLeft: 0, width: 200 }}
            >
              Close
          </Button>

            <Button
              color="info"
              onClick={e => {
               this.toggleAdditionalFilters()
              }}
              style={{ margin: 10, marginLeft: 0, width: 200 }}
            >
              {" "}
              More Filters
            </Button>
          </Col>

        </Row>
        <br />
        <br />
      </div>

    );
  }
}
