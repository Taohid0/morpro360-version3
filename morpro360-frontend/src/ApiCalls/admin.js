import axios from "axios";
import AppConfig from "../config/AppConfig";

import UserService from "../services/User";

export async function createAdmin(data)
{
    const userService= new UserService();
    const user = await userService.getUser()

    const {adminURL} = AppConfig;

    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "POST",
        url:adminURL,
        data
    });
    return promise;
}
export async function getAllAdmins()
{
    const userService= new UserService();
    const user = await userService.getUser()

    const {adminURL} = AppConfig;

    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "GET",
        url:adminURL,
    });
    return promise;
}
