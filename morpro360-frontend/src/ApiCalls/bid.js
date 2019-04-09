import axios from "axios";
import AppConfig from "../config/AppConfig";


import UserService from "../services/User";

export async function createBid(data)
{
    const userService= new UserService();
    const user = await userService.getUser();

    const {bidURL} = AppConfig;
 
    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "POST",
        url:bidURL,
        data
    });
    return promise;
}

export async function getMyBids()
{
    const userService= new UserService();
    const user = await userService.getUser();

    const {myBidsURL} = AppConfig;
 
    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "GET",
        url:myBidsURL,

    });
    return promise;
}

export async function getWinnningBids()
{
    const userService= new UserService();
    const user = await userService.getUser();

    const {winningBidsURL} = AppConfig;
 
    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "GET",
        url:winningBidsURL,

    });
    return promise;
}

export async function assignBid(bidId,loadId)
{
    const userService= new UserService();
    const user = await userService.getUser();

    const {assignBidURL} = AppConfig;
 
    const promise = await axios({
        headers:{
            "Authorization":user.token,
        },
        method: "POST",
        url:assignBidURL,
        data:{bidId,loadId}

    });
    return promise;
}