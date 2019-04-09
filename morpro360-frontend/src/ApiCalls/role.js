import axios from "axios";
import AppConfig from "../config/AppConfig";

import UserService from "../services/User";

export async function getRoles()
{
    const userService= new UserService();
    const user = await userService.getUser()

    const {roleURL} = AppConfig;

    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "GET",
        url:roleURL,
    });
    return promise;
}
