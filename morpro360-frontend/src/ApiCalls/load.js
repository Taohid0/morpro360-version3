import axios from "axios";
import AppConfig from "../config/AppConfig";

import UserService from "../services/User";

export async function createLoad(data) {
  const userService = new UserService();
  const user = await userService.getUser();

  const { loadURL } = AppConfig;

  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "POST",
    url: loadURL,
    data
  });
  return promise;
}

export async function loadDetails(id) {
  const userService = new UserService();
  const user = await userService.getUser();

  let { loadDetailsURL } = AppConfig;
  loadDetailsURL += "/" + id;

  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "GET",
    url: loadDetailsURL
  });
  console.log(promise);
  return promise;
}
export async function loadDetailsAllFields(id) {
  const userService = new UserService();
  const user = await userService.getUser();

  let { loadDetailsAllFieldsURL } = AppConfig;
  loadDetailsAllFieldsURL += "/" + id;
  console.log(loadDetailsAllFieldsURL);
  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "GET",
    url: loadDetailsAllFieldsURL
  });
  console.log(promise);
  return promise;
}
export async function availableLoad() {
  const userService = new UserService();
  const user = await userService.getUser();

  const { availableLoadURL } = AppConfig;

  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "POST",
    url: availableLoadURL
  });
  return promise;
}

export async function allLoadAdmin(status) {
  const userService = new UserService();
  const user = await userService.getUser();

  let { allLoadsAdminURL } = AppConfig;
  if (status) {
    allLoadsAdminURL += "?status=" + status;
  }

  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "GET",
    url: allLoadsAdminURL
  });
  return promise;
}
export async function relatedBids(loadId) {
  const userService = new UserService();
  const user = await userService.getUser();

  let { relatedBidsURL } = AppConfig;

  relatedBidsURL += "?loadId=" + loadId;

  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "GET",
    url: relatedBidsURL
  });
  return promise;
}

export async function changeLoadStatus(loadId, status) {
  const userService = new UserService();
  const user = await userService.getUser();

  let { changeLoadStatusURL } = AppConfig;

  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "POST",
    url: changeLoadStatusURL,
    data: {
      loadId,
      status
    }
  });
  return promise;
}
