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
import { getAllUsersAdmin } from "../../../ApiCalls/user";
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
      users: [],
      isErrorModalVisible: false,
      modalErrorMessage: "",
      isSuccessModalVisible: false,
      successModalTitle: "Sucessful",
      modalSuccessMessage: "",
      isLoadDetailsModalVisible: false,
      userDetails: {},
      drivers : [],
      userId: "",
      user:{},
      loading:false,
      companyStatus:0,
    };

    this.userService = new UserService();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleDangerModal = this.toggleDangerModal.bind(this);
    this.toggleSuccessModal = this.toggleSuccessModal.bind(this);
    this.toggleLoadDetaildModal = this.toggleLoadDetaildModal.bind(this);
    this.loadUserOrRedirect = this.loadUserOrRedirect.bind(this);
    this.loadAllUsers = this.loadAllUsers.bind(this);
    this.loadCompanyDrivers = this.loadCompanyDrivers.bind(this);
  }
  componentWillMount() {
    this.loadUserOrRedirect();
    this.loadAllUsers();
  }
  async loadAllUsers() {
    this.setState({loading:true});
    try{
    const promise = await getAllUsersAdmin(this.state.companyStatus);
    console.log("user data",promise);
    const data = promise.data.data;
    this.setState({ users: data });
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
    this.setState({loading:false});
  }
  async loadCompanyDrivers(id)
  {
    console.log("id",id);
    this.setState({loading:true});
    try{
    const promise = await getCompanyDrivers(id);
    const data = promise.data.data;
    console.log("driver data",promise.data);
    this.setState({drivers:data,loading:false});
    }
    catch (err) {
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


  async loadUserOrRedirect() {
    const user = await this.userService.getUser();

    if (!user) {
      this.props.history.push("/login");
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
        <UserDetailsModal
          isVisible={this.state.isLoadDetailsModalVisible}
          errors={this.state.loadDetailsInfo}
          toggleModal={this.toggleLoadDetaildModal}
          //title = {this.state.successModalTitle}
          userDetails={this.state.user}
          reloadAllUsers={this.loadAllUsers}
          drivers = {this.state.drivers}

        />
          <div className="row">
          <div className="col-md-2">
            <h3>Select status </h3>
          </div>
          <div className="col-md-2">
            <Input
              type="select"
              name="companyStatus"
              id="companyStatus"
              value={this.state.companyStatus}
              onChange={this.handleChange}
            >
              <option key="0" value="0">
                Inactive
              </option>
              <option key="1" value="1">
                Active
              </option>
            </Input>
          </div>
          <div className="col-md-2">
            <button className="btn btn-info" onClick={this.loadAllUsers}>
              Search companies
            </button>
          </div>
        </div>
        <br />
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" />
                <strong>Pending Companies</strong>
                {/* <small> custom content</small> */}
              </CardHeader>
              <CardBody>
                <ListGroup>
                  {this.state.users.map(user => {
                    return (
                      <ListGroupItem action key={user.id}>
                        <ListGroupItemHeading>{user.name}</ListGroupItemHeading>
                        <ListGroupItemText className="row">
                          {/* <div class="">
                        <div class="row"> */}
                          <b className="col-sm">
                            Phone : {user.phone}
                          </b>
                          <b className="col-sm">Email : {user.email}</b>
                          <b className="col-sm">MC# : {user.MC}</b>
                          <b className="col-sm">DOT# : {user.DOT}</b>
                          <Button
                            className="col-sm btn btn-info"
                            onClick={() => {
                              this.loadCompanyDrivers(user.id);
                              this.toggleLoadDetaildModal();
                              this.setState({ user:user });
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
