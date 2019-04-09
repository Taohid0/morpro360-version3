import React, { Component } from "react";
import AddAdminForm from "../../Forms/Admin/AddAdminForm";

import UserService from "../../../services/User";
export default class AddAdmin extends Component {
  constructor(props) {
    super(props);

    this.userService = new UserService();
    this.loadUserOrRedirect = this.loadUserOrRedirect.bind(this);
  }

  componentWillMount() {
    // this.loadUserOrRedirect();
  }
  async loadUserOrRedirect() {
    const user = await this.userService.getUser();

    if (!user) {
      this.props.history.push("/login");
    }
  }

  render() {
    return <AddAdminForm history={this.props.history} />;
  }
}
