import React, { Component } from "react";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
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
import LoadingOverlay from "react-loading-overlay";
import { getUserDetails } from "../../../ApiCalls/user";
import UserService from "../../../services/User";
import validateInput from "../../../validation/input";

import { getCompanyDrivers } from "../../../ApiCalls/driver";
import DangerModal from "../../CustomModals/DangerModal";
import SuccessModal from "../../CustomModals/SuccessModal";
import UserDetailsModal from "../../CustomModals/UserDetailsModal";

export default class ShowUsersAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      isSuccessModalVisible: false,
      successModalTitle: "Sucessful",
      modalSuccessMessage: "",
      loading: false,
      userDetails: {},
      drivers: []
    };
    this.userService = new UserService();

    this.loadUserDetails = this.loadUserDetails.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
  }
  //this.props.goToDashboard();
  //this will be added later

  componentWillMount() {
    this.loadUserDetails();
    this.loadCompanyDrivers();
  }
  toggleSuccessModal() {
    this.setState((state, props) => ({
      isSuccessModalVisible: !state.isSuccessModalVisible
    }));
  }

  async loadUserDetails() {
    const user = await this.userService.getUser();
    this.setState({ loading: true });
    try {
      const promise = await getUserDetails(user.id);
      const data = promise.data.data;
      this.setState({ userDetails: data });
      console.log("promise", promise);
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

  async loadCompanyDrivers() {
    const user = await this.userService.getUser();

    this.setState({ loading: true });
    try {
      const promise = await getCompanyDrivers(user.id);
      const data = promise.data.data;
      console.log("driver data", promise.data);
      this.setState({ drivers: data, loading: false });
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
  }

  render() {
    const user = this.state.userDetails;
    const drivers = this.state.drivers;
    console.log(user);
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify" />
          <strong>My Company Details</strong>
          {/* <small> custom content</small> */}
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
          <h2>Company Name : {user.name}</h2>
          <div className="row">
            <b className="col-sm">Phone : {user.phone}</b>
            <b className="col-sm">Email : {user.email}</b>
            <b className="col-sm">MC# : {user.MC}</b>
            <b className="col-sm">DOT# : {user.DOT}</b>
          </div>
          <div className="row">
            <b className="col-sm">
              Status : {user.active ? "Active" : "Inactive"}
            </b>
            <b className="col-sm">State : {user.state}</b>
            <b className="col-sm">City : {user.city}</b>
            <b className="col-sm">Address : {user.address}</b>
          </div>
          <div>
            {user.description ? "Description : " + user.description : ""}
            <br />
            {drivers.length > 0 ? (
              <div>
                <h3>Drivers</h3>
                <h3>
                  Number of drivers : {drivers.length}
                </h3>
              </div>
            ) : (
              "No drivers added by this company"
            )}
            {drivers.map(driver => {
              const view = (
                <div key={driver.id}>
                  <h4><strong>Name : {driver.name}</strong></h4>
                  <p>Phone : {driver.phone}</p>
                  <p>Email : {driver.email}</p>
                  <p>License Number : {driver.license}</p>
                  <p>State : {driver.state}</p>
                  <p>City : {driver.city}</p>
                  <p>Address : {driver.address}</p>
                </div>
              );
              return view;
            })}
          </div>
        </CardBody>
      </Card>
    );
  }
}
