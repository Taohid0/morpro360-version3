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
import LoadingOverlay from "react-loading-overlay";

import { allLoadAdmin, loadDetails } from "../../../ApiCalls/load";
import UserService from "../../../services/User";
import validateInput from "../../../validation/input";

import DangerModal from "../../CustomModals/DangerModal";
import SuccessModal from "../../CustomModals/SuccessModal";
import LoadDetailsModal from "../../CustomModals/LoadDetailsModal";

export default class AllLoadsAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loads: [],
      status: "A",
      isErrorModalVisible: false,
      modalErrorMessage: "",
      isSuccessModalVisible: false,
      successModalTitle: "Sucessful",
      modalSuccessMessage: "",
      isLoadDetailsModalVisible: false,
      loadDetails: {},
      companyDropdown: [],
      loadId: "",
      loading: false
    };
    this.getLoads = this.getLoads.bind(this);
    this.userService = new UserService();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleDangerModal = this.toggleDangerModal.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
    this.toggleLoadDetaildModal = this.toggleLoadDetaildModal.bind(this);
    this.loadUserOrRedirect = this.loadUserOrRedirect.bind(this);
  }
  componentDidMount() {
    this.getLoads();
    this.loadUserOrRedirect();
  }

  async loadUserOrRedirect() {
    const user = await this.userService.getUser();

    if (!user) {
      this.props.history.push("/login");
    }
  }

  async getLoads() {
    this.setState({ loading: true });
    try {
      const promise = await allLoadAdmin(this.state.status);
      this.setState({ loading: false });
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
  async handleSubmit(e) {
    e.preventDefault();
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

        <div className="row">
          <div className="col-md-2">
            <h3>Select status </h3>
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
            <button className="btn btn-info" onClick={this.getLoads}>
              Search Load Boards
            </button>
          </div>
        </div>
        <br />

        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" />
                <strong>Load Boards</strong>
                {/* <small> custom content</small> */}
              </CardHeader>
              <CardBody>
                <ListGroup>
                  {this.state.loads.map(load => {
                    return (
                      <ListGroupItem action key={load.id}>
                        <ListGroupItemHeading>{load.name}</ListGroupItemHeading>
                        <ListGroupItemText className="row">
                          {/* <div class="">
                        <div class="row"> */}
                          <b className="col-sm">
                            From : {load.pickUpCity}, {load.pickUpState}
                          </b>
                          <b className="col-sm">
                            To: {load.dropOffCity}, {load.dropOffState}
                          </b>
                          <b className="col-sm">Distance : {load.distance}</b>
                          <b className="col-sm">Weight : {load.weight}</b>
                          <b className="col-sm">Rate : {load.rate}</b>
                          <Button
                            className="col-sm btn btn-info"
                            onClick={() => {
                              this.props.history.push({
                                pathname: "load-details-admin/" + load.id,
                                state: { load: load }
                              });
                            }}
                          >
                            See Details
                          </Button>
                        </ListGroupItemText>
                      </ListGroupItem>
                    );
                  })}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
