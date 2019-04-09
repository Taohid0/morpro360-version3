import React, { Component } from "react";
import AddLoadForm from "../../Forms/Load/AddLoadForm";

import UserService from "../../../services/User";

export default class AddLoad extends Component {
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
    return <AddLoadForm history={this.props.history}/>;
  }
}
