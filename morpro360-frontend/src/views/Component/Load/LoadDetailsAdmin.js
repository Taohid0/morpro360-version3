import React, { Component } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Row,
  TabContent,
  TabPane,
  Input
} from "reactstrap";

import {
  allLoadAdmin,
  loadDetails,
  loadDetailsAllFields,
  relatedBids,
  changeLoadStatus
} from "../../../ApiCalls/load";
import LoadingOverlay from "react-loading-overlay";
import { assignBid } from "../../../ApiCalls/bid";
import UserService from "../../../services/User";
import validateInput from "../../../validation/input";

import DangerModal from "../../CustomModals/DangerModal";
import SuccessModal from "../../CustomModals/SuccessModal";
import LoadDetailsModal from "../../CustomModals/LoadDetailsModal";
import { truncate } from "fs";

export default class LoadDetailsAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loads: [],
      status: "",
      isErrorModalVisible: false,
      modalErrorMessage: "",
      isSuccessModalVisible: false,
      successModalTitle: "Sucessful",
      modalSuccessMessage: "",
      isLoadDetailsModalVisible: false,
      loadDetails: null,
      companyDropdown: [],
      loadId: "",
      relatedBids: []
    };
    this.previousStatus = "";
    this.getLoads = this.getLoads.bind(this);
    this.userService = new UserService();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleDangerModal = this.toggleDangerModal.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
    this.toggleLoadDetaildModal = this.toggleLoadDetaildModal.bind(this);
    this.getLoadDetails = this.getLoadDetails.bind(this);
    this.getLoadDetails = this.getLoadDetails.bind(this);
    this.loadUserOrRedirect = this.loadUserOrRedirect.bind(this);
    this.renderLoadDetails = this.renderLoadDetails.bind(this);
    this.renderBids = this.renderBids.bind(this);
    this.loadRelatedBids = this.loadRelatedBids.bind(this);
    this.renderChangeStatusForm = this.renderChangeStatusForm.bind(this);
    this.makeStatusChange = this.makeStatusChange.bind(this);
  }
  componentDidMount() {
    const loadId = this.props.match.params.loadId;
    this.loadUserOrRedirect();
    this.getLoads();
    this.getLoadDetails(loadId);
  }
  async getLoadDetails(id) {
    this.setState({ loading: true });
    try {
      const promise = await loadDetailsAllFields(id);
      const data = promise.data;
      console.log(data);
      this.setState({ loadDetails: data.data, status: data.data.status });
      this.previousStatus = data.data.status;
      if (data.data) {
        this.loadRelatedBids(data.data.id);
      }
    } catch (err) {
      console.log(err);
      const response = err.response;
      if (response && response.status === 401) {
        const errorMessage = "Session expired, please login to continue";
        alert(errorMessage);
        this.userService.clearData();
        this.props.history.push("/login");
      }
    }
    this.setState({ loading: false });
  }

  async loadRelatedBids(id) {
    this.setState({ loading: true });
    try {
      const promise = await relatedBids(id);
      this.setState({ relatedBids: promise.data.data });
    } catch (err) {
      console.log(err);
      const response = err.response;
      if (response && response.status === 401) {
        const errorMessage = "Session expired, please login to continue";
        alert(errorMessage);
        this.userService.clearData();
        this.props.history.push("/login");
      }
    }
    this.setState({ loading: false });
  }

  async loadUserOrRedirect() {
    const user = await this.userService.getUser();

    if (!user) {
      this.props.history.push("/login");
    }
  }
  async makeStatusChange() {
    const statusPriorityObject = {
      A: 1,
      P: 2,
      I: 3,
      D: 4
    };
    const statusDetailsObject = {
      A: "Available",
      P: "Picked Up",
      I: "Inroute",
      D: "Delivered"
    };
    if (
      statusPriorityObject[this.state.status] <
      statusPriorityObject[this.previousStatus]
    ) {
      alert("Load board status shouldn't go in backward");
      return;
    } else if (this.state.status === this.previousStatus) {
      alert(
        "This load board is aleady in " +
          statusDetailsObject[this.state.status] +
          " status"
      );
      return;
    }
    this.setState({ loading: true });
    try {
      const promise = await changeLoadStatus(
        this.state.loadDetails.id,
        this.state.status
      );
      if (promise.data.status) {
        const modalSuccessMessage = "Successfully load board status updated";
        this.setState({ modalSuccessMessage });
        this.toggleSuccessModal();
      } else {
        const modalErrorMessage = promise.data.errors.join("\n");
        this.setState({ modalErrorMessage });
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
      }
    }
    this.setState({ loading: false });
  }

  async handleSubmit(bidId, loadId, rate, name) {
    const isConfirm = window.confirm(
      "Do you really want to assign this load to " +
        name +
        " for $" +
        rate +
        " ?"
    );
    if (!isConfirm) {
      return;
    }
    this.setState({ loading: true });
    try {
      const promise = await assignBid(bidId, loadId);
      console.log(promise);
      const status = promise.data.status;
      if (!status) {
        const modalErrorMessage = promise.data.errors.join("\n");
        this.setState({ modalErrorMessage });
        this.toggleDangerModal();
      } else {
        const modalSuccessMessage =
          "Successfully " + this.state.loadDetails.name + " load boad assigned";
        this.setState({ modalSuccessMessage });
        this.toggleSuccessModal();
        // this.props.history.push("/all-loads-admin");
      }
    } catch (err) {
      const response = err.response;
      console.log(err.response);
      if (response && response.status === 401) {
        const errorMessage = "Session expired, please login to continue";
        alert(errorMessage);
        this.userService.clearData();
        this.props.history.push("/login");
      }
    }
    this.setState({ loading: false });
  }

  async getLoads() {
    this.setState({ loading: true });
    try {
      const promise = await allLoadAdmin(this.state.status);
      console.log(promise);
      if (!promise.data.status) {
        alert(promise.data.errors);
        return;
      }
      const data = promise.data.data;
      console.log(data);
      const tempLoads = [];
      for (let load of data) {
        tempLoads.push(load);
      }
      console.log(tempLoads);
      this.setState({ loads: tempLoads });
    } catch (err) {
      console.log(err);
      const response = err.response;
      if (response && response.status === 401) {
        const errorMessage = "Session expired, please login to continue";
        alert(errorMessage);
        this.userService.clearData();
        this.props.history.push("/login");
      }
    }
    this.setState({ loading: false });
  }

  toggleDangerModal() {
    this.setState((state, props) => ({
      isErrorModalVisible: !state.isErrorModalVisible
    }));
  }
  toggleLoadDetaildModal() {
    this.setState((state, props) => ({
      isLoadDetailsModalVisible: !state.isLoadDetailsModalVisible
    }));
  }
  toggleSuccessModal() {
    this.setState((state, props) => ({
      isSuccessModalVisible: !state.isSuccessModalVisible
    }));
  }
  assignLoadId(id) {}

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  renderChangeStatusForm() {
    const view = (
      <div className="row" style={{ paddingTop: "10px" }}>
        <div className="col-md-2">
          <h3>Change status </h3>
        </div>
        <div className="col-md-2">
          <Input
            type="select"
            name="status"
            id="status"
            value={this.state.status}
            onChange={this.handleChange}
          >
            <option key="A" value="A">
              Available
            </option>
            <option key="P" value="P">
              Picked Up
            </option>
            <option key="I" value="I">
              Inroute
            </option>
            <option key="D" value="D">
              Delivered
            </option>
          </Input>
        </div>
        <div className="col-md-2">
          <button className="btn btn-info" onClick={this.makeStatusChange}>
            Submit
          </button>
        </div>
      </div>
    );
    if (this.state.loadDetails.status !== "A") {
      return view;
    }
    return "";
  }

  renderLoadDetails() {
    if (!this.state.loadDetails) {
      return "Nothing here now";
    }
    const load = this.state.loadDetails;
    const admin = load.admin;
    const role = admin.Role;

    const view = (
      <div>
        <h5>Load Name :{load.name}</h5>

        <div>Product Details : {load.productDetails}</div>
        <div className="row">
          <div className="col-md-3">Weight : {load.weight}</div>
          <div className="col-md-3">Distance : {load.distance}</div>
          <div className="col-md-3">Rate : {load.rate}</div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-3">Pick Up State : {load.pickUpState}</div>
          <div className="col-md-3">Pick Up City : {load.pickUpCity}</div>
          <div className="col-md-3">
            Pick Up Zip Code : {load.pickUpZipCode}
          </div>
          <div className="col-md-3">Pick Up Date : {load.pickUpDate}</div>
        </div>
        <div>Pick Up Address : {load.pickUpAddress}</div>
        <br />
        <div className="row">
          <div className="col-md-3">Drop Off State : {load.dropOffState}</div>
          <div className="col-md-3">Drop Off City : {load.dropOffCity}</div>
          <div className="col-md-3">
            Drop Off Zip Code : {load.dropOffZipCode}
          </div>
          <div className="col-md-3">Drop Off Date : {load.dropOffDate}</div>
        </div>
        <div>Drop Off Address : {load.dropOffAddress}</div>
        <br />
        <h3>This load board is added by : </h3>
        <div>
          Name : {admin.firstName} {admin.lastName} ({role.name})
        </div>
        <div>Email : {admin.email} </div>
        <div>Phone : {admin.phone}</div>

        {this.renderChangeStatusForm()}
      </div>
    );

    return view;
  }

  renderBids() {
    if (!this.state.relatedBids) {
      return "Nothing here now";
    }
    const bids = this.state.relatedBids.map(bid => {
      const view = (
        <Card key={bid.id}>
          {bid.isAssigned ? (
            <CardHeader style={{ backgroundColor: "#3a8e40" }}>
              <i className="fa fa-align-justify" />
              <strong>
                Bidder : {bid.bidder.name} (MC# : {bid.bidder.MC}, DOT#:
                {bid.bidder.DOT}) (ASSIGNED)
              </strong>
            </CardHeader>
          ) : (
            <CardHeader>
              <i className="fa fa-align-justify" />
              <strong>
                Bidder : {bid.bidder.name} (MC# : {bid.bidder.MC}, DOT#:
                {bid.bidder.DOT})
              </strong>
            </CardHeader>
          )}

          <CardBody>
            <div key={bid.id}>
              <div className="row">
                <div className="col-md-4">
                  <strong>Proposed rate : ${bid.rate}</strong>
                </div>
                <div className="col-md-4">Email : {bid.bidder.email}</div>
                <div className="col-md-4">Phone : {bid.bidder.phone}</div>
              </div>
              <div className="row">
                <div className="col-md-4">State : {bid.bidder.state}</div>
                <div className="col-md-4">City : {bid.bidder.city}</div>
                <div className="col-md-4">Address : {bid.bidder.address}</div>
              </div>

              <div>
                {bid.bidder.description
                  ? "Company Description : " + bid.bidder.description
                  : ""}
              </div>
              <br />
              <div>{bid.note ? "Additional Note :" + bid.note : ""}</div>
              <h5>Driver Information</h5>
              <div className="row">
                <div className="col-md-4">Name : {bid.driver.name}</div>
                <div className="col-md-4">Phone : {bid.driver.phone}</div>
                <div className="col-md-4">Email : {bid.driver.email}</div>
              </div>
              <div className="row">
              <div className="col-md-4">License : {bid.driver.license}</div>
                <div className="col-md-4">State : {bid.driver.state}</div>
                <div className="col-md-4">City : {bid.driver.city}</div>
              </div>
              <div>Address : {bid.driver.address}</div>
              <br />
              {this.state.loadDetails.status === "A" ? (
                <button
                  className="btn btn-success"
                  onClick={() =>
                    this.handleSubmit(
                      bid.id,
                      bid.loadId,
                      bid.rate,
                      bid.bidder.name
                    )
                  }
                >
                  Assign this load this bidder
                </button>
              ) : (
                ""
              )}
            </div>
          </CardBody>
        </Card>
      );
      return view;
    });
    return bids;
  }
  render() {
    return (
      <div className="animated fadeIn">
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
          goToDashboard={() => this.props.history.push("/all-loads-admin")}
        />
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" />
                <strong>Load Board Details</strong>
              </CardHeader>
              <CardBody>{this.renderLoadDetails()}</CardBody>
            </Card>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" />
                <strong>Bids for this load</strong>
              </CardHeader>
              <CardBody>{this.renderBids()}</CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
