import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
import adminNavigation from "../../_navAdmin";
import brokerNavigation from "../../_navBroker";
// routes config
import routes from "../../routes";
import { logout } from "../../ApiCalls/auth";
import UserService from "../../services/User";

const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "user"
    };
    this.userService = new UserService();
  }
  componentDidMount() {
    this.getRole();
  }
  async getRole() {
    const rolePromise = await this.userService.adminRole();
    if (rolePromise) {
      const role = rolePromise.toLowerCase();
      this.setState({role});
    }
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  async signOut(e) {
    e.preventDefault();

    const promise = await logout();
    const data = promise.data;
    console.log(data);
    if (data.status) {
      this.userService.clearData();
      this.props.history.push("/login");
    } else {
      alert("Something went wrong, please try again later");
    }
    this.props.history.push("/login");
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader props={this.props} onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              {this.state.role === "admin" ? (
                <AppSidebarNav navConfig={adminNavigation} {...this.props} />
              ) : this.state.role === "broker" ? (
                <AppSidebarNav navConfig={brokerNavigation} {...this.props} />
              ) : (
                <AppSidebarNav navConfig={navigation} {...this.props} />
              )}
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => <route.component {...props} />}
                      />
                    ) : null;
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
