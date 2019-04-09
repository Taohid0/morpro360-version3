import React, { Component } from "react";
import AddDriverForm from "../../Forms/Driver/AddDriverForm";

import UserService from "../../../services/User";
export default class AddDriver extends Component {
  constructor(props) {
    super(props);

    this.userService = new UserService();
    this.loadUserOrRedirect = this.loadUserOrRedirect.bind(this);
  }

  componentWillMount() {
    this.loadUserOrRedirect();
  }
  async loadUserOrRedirect() {
    const user = await this.userService.getUser();

    if (!user) {
      this.props.history.push("/login");
    }
  }

  render() {
    return <AddDriverForm history={this.props.history}/>;
  }
}
