import axios from "axios";
import AppConfig from "../config/AppConfig";
import UserService from "../services/User";

export async function createUser(data) {
  const { userURL } = AppConfig;

  const promise = await axios({
    method: "POST",
    url: userURL,
    data
  });
  return promise;
}

export async function getAllUsers() {
  const { userURL } = AppConfig;

  const promise = await axios({
    method: "GET",
    url: userURL
  });
  return promise;
}

export async function getUserDetails(id) {
  const userService = new UserService();
  const user = await userService.getUser();

  let { userDetailsURL } = AppConfig;
  userDetailsURL += "/" + id + "";
  console.log(userDetailsURL);
  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "GET",
    url: userDetailsURL
  });
  return promise;
}

export async function getAllUsersAdmin(status) {
  const userService = new UserService();
  const user = await userService.getUser();

  let { allUsersURL } = AppConfig;
  allUsersURL += "?status=" + status;

  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "GET",
    url: allUsersURL
  });
  console.log(promise);
  return promise;
}
export async function activateUser(id) {
  const userService = new UserService();
  const user = await userService.getUser();

  const { activateUserURL } = AppConfig;

  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "POST",
    url: activateUserURL,
    data: { id }
  });
  console.log(promise);
  return promise;
}

export async function deactivateUser(id) {
  const userService = new UserService();
  const user = await userService.getUser();

  const { deactivateUserURL } = AppConfig;

  const promise = await axios({
    headers: {
      Authorization: user.token
    },
    method: "POST",
    url: deactivateUserURL,
    data: { id }
  });
  console.log(promise);
  return promise;
}
