import axios from "axios";
import AppConfig from "../config/AppConfig";

import UserService from "../services/User";
export async function login(data) {
  const { loginURL } = AppConfig;

  try {
    const promise = await axios({
      method: "POST",
      url: loginURL,
      data
    });
    return promise;
  } catch (err) {
    return err.response;
  }
}


export async function adminLogin(data) {
  const { adminLoginURL } = AppConfig;

  try {
    const promise = await axios({
      method: "POST",
      url: adminLoginURL,
      data
    });
    return promise;
  } catch (err) {
    return err.response;
  }
}


export async function logout()
{
    const userService= new UserService();
    const user = await userService.getUser()
    let {logoutURL} = AppConfig;

    const rolePromise = await userService.adminRole();
    if (rolePromise) {
      const {adminLogoutURL} = AppConfig;
      logoutURL = adminLogoutURL;
    }
    

    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "POST",
        url:logoutURL
    });
    return promise;
}