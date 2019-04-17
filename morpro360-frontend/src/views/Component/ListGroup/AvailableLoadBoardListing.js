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
  TabPane
} from "reactstrap";
import LoadingOverlay from "react-loading-overlay";

import { availableLoad, loadDetails } from "../../../ApiCalls/load";
import UserService from "../../../services/User";
import validateInput from "../../../validation/input";

import DangerModal from "../../CustomModals/DangerModal";
import SuccessModal from "../../CustomModals/SuccessModal";
import LoadDetailsModal from "../../CustomModals/LoadDetailsModal";
import FilterLoadBoardsModal from "../../CustomModals/FilterLoadBoardsModal";

export default class AvailableLoadBoardListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loads: [],
      isErrorModalVisible: false,
      isFilterModalVisible: false,
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
    this.getAvailableLoad = this.getAvailableLoad.bind(this);
    this.userService = new UserService();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleDangerModal = this.toggleDangerModal.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
    this.toggleLoadDetaildModal = this.toggleLoadDetaildModal.bind(this);
    this.getLoadDetails = this.getLoadDetails.bind(this);
    this.getLoadDetails = this.getLoadDetails.bind(this);
    this.loadUserOrRedirect = this.loadUserOrRedirect.bind(this);
    this.toggleFilterModal = this.toggleFilterModal.bind(this);
  }
  componentWillMount() {
    this.getAvailableLoad();
    this.loadUserOrRedirect();
  }
  async getLoadDetails(id) {
    this.setState({ loading: true });
    try {
      const promise = await loadDetails(id);
      const data = promise.data.data;
      this.setState({ loadDetails: data });
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

  async loadUserOrRedirect() {
    const user = await this.userService.getUser();

    if (!user) {
      this.props.history.push("/login");
    }
  }

  async getAvailableLoad() {
    this.setState({ loading: true });
    this.setState({ loading: false });
    try {
      const promise = await availableLoad();
      console.log(promise);
      if (!promise.data.status) {
        alert(promise.data.errors);
        return;
      }
      const data = promise.data.data;
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
  toggleFilterModal() {
    this.setState((state, props) => ({
      isFilterModalVisible: !state.isFilterModalVisible
    }));
  }
  assignLoadId(id) { }

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
        <LoadDetailsModal
          loadId={this.state.loadId}
          isVisible={this.state.isLoadDetailsModalVisible}
          errors={this.state.loadDetailsInfo}
          toggleModal={this.toggleLoadDetaildModal}
          //title = {this.state.successModalTitle}
          loadDetails={this.state.loadDetails}
          reloadAvailableLoads={this.getAvailableLoad}
          goToDashboard={() => this.props.history.push("/dashboard")}
        />

        <FilterLoadBoardsModal
          loadId={this.state.loadId}
          isVisible={this.state.isFilterModalVisible}
          errors={this.state.loadDetailsInfo}
          toggleModal={this.toggleFilterModal}
          //title = {this.state.successModalTitle}
          loadDetails={this.state.loadDetails}
          reloadAvailableLoads={this.getAvailableLoad}
          goToDashboard={() => this.props.history.push("/dashboard")}
        />

        <div style={{ paddingBottom: 10 }}>
          <button className="btn btn-info" onClick={this.toggleFilterModal}>Filter Load Boards</button>
        </div>
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
                              this.toggleLoadDetaildModal();
                              this.getLoadDetails(load.id);
                              this.setState({ loadId: load.id });
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
