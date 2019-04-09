import axios from "axios";
import AppConfig from "../config/AppConfig";

import UserService from "../services/User";

export async function createDriver(data)
{
    const userService= new UserService();
    const user = await userService.getUser()

    const {driverURL} = AppConfig;

    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "POST",
        url:driverURL,
        data
    });
    return promise;
}

export async function getCompanyDrivers(id)
{
    const userService= new UserService();
    const user = await userService.getUser()

    let {companyDriversURL} = AppConfig;
    companyDriversURL +="/"+id;
    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "GET",
        url:companyDriversURL,
    });
    return promise;
}