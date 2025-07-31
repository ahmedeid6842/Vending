import _ from "lodash";
import {Request, Response} from 'express';
import { getUserService, createUserService, updateUserService, deleteUserService, registerUserService, loginUserService, updateUserWithValidationService } from "../services/user"
import { IUserDocument } from "../models/user";

export const registerController = async (req: Request, res: Response) => {
    /**
     * DONE: validate if user already logged in 
     * DONE: validate request body to register criteria
     * DONE: check if userName is duplicated and someone else use it
     * DONE: create a new user
     * DONE: send a cookie containing access token
    **/

    const result = await registerUserService(req.body);

    if (!result.success) {
        return res.status(result.statusCode || 400).send(result.error);
    }

    // Set cookie with access token
    if (result.data?.user) {
        res.cookie("accessjwt", result.data.user.generateAuthToken(), {
            secure: process.env.NODE_ENV == 'production' ? true : false,
            path: "/",
            httpOnly: true,
            sameSite: 'strict'
        });

        return res.status(201).send({ 
            message: result.message, 
            user: _.omit(result.data.user.toObject(), 'password') 
        });
    }

    return res.status(500).send({ message: "Registration failed" });
}

export const loginController = async (req: Request, res: Response) => {
    /**
     * DONE: check if user already logged in or not
     * DONE: validate request body to match login criteria
     * DONE: check if user email already exsists or not
     * DONE: compare password and verify them
     * DONE: if everything is ok send a cookie with access token
     * DONE: send a cookie contains access token 
    **/

    const result = await loginUserService(req.body);

    if (!result.success) {
        return res.status(result.statusCode || 400).send(result.error);
    }

    // Set cookie with access token
    if (result.data?.user) {
        res.cookie("accessjwt", result.data.user.generateAuthToken(), {
            secure: process.env.NODE_ENV == 'production' ? true : false,
            path: "/",
            httpOnly: true,
            sameSite: 'strict'
        });

        return res.status(200).send({ 
            message: result.message, 
            user: _.omit(result.data.user.toObject(), 'password') 
        });
    }

    return res.status(500).send({ message: "Login failed" });
}

export const logoutController = async (req: Request, res: Response) => {
    /**
     * DONE: delete access token which saved in cookie
    **/
    res.clearCookie("accessjwt");
    return res.send({ message: "logged out" });
}

export const getUserController = async (req: Request, res: Response) => {
    /**
     * DONE: user must be authenticated to get his own data 
     * DONE: get logged in user data
     */
    return res.status(200).send({ user: _.omit(req.user?.toObject(), 'password') });
}

export const updateUserController = async (req: Request, res: Response) => {
    /**
     * DONE: user must be authenticated
     * DONE: user must be authorized , only the account owner can update
     * DONE: validate request body to match update user criteria
     * DONE: if the body contain userName property then validate if userName is unique
     * DONE: update user with given property in request body
     * DONE: regenerate access token to recover user attribute in the token
     * DONE: if everything is ok send a cookie with the new access token
     */
    const result = await updateUserWithValidationService(req.user?.userName || "", req.body);

    if (!result.success) {
        return res.status(result.statusCode || 400).send(result.error);
    }

    // Set cookie with new access token
    if (result.data?.user) {
        res.cookie("accessjwt", result.data.user.generateAuthToken(), {
            secure: process.env.NODE_ENV == 'production' ? true : false,
            path: "/",
            httpOnly: true,
            sameSite: 'strict'
        });

        return res.status(201).send({ 
            message: result.message, 
            user: _.omit(result.data.user.toObject(), 'password') 
        });
    }

    return res.status(500).send({ message: "User update failed" });
}

export const deleteUserController = async (req: Request, res: Response) => {
    /**
     * DONE: user must be authenticated
     * DONE: user must be authorized , only the account owner can update
     * DONE: delete user from DB 
     * DONE: delete access token which saved in cookie
    */
    let deleted = await deleteUserService({ userName: req.user.userName });
    if (!deleted) return res.status(404).send({ path: "userName", message: `"userName":${req.user.userName} not found` });

    res.clearCookie("accessjwt");
    return res.send({ message: "user deleted" })
}
