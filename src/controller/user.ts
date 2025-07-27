import _ from "lodash";
import {Request, Response} from 'express';
import { create_updateUserValidation, loginValidation } from "../validators/user";
import { getUserService, createUserService, updateUserService, deleteUserService } from "../services/user"
import { IUserDocument } from "../models/user";

export const registerController = async (req: Request, res: Response) => {
    /**
     * DONE: validate if user already logged in 
     * DONE: validate request body to register criteria
     * DONE: check if userName is duplicated and someone else use it
     * DONE: create a new user
     * DONE: send a cookie containing access token
    **/
    const { error } = create_updateUserValidation(req.body);
    if (error) return res.status(400).send(error.details);

    let user = await getUserService({ userName: req.body.userName })
    if (user) return res.status(400).send({ path: "userName", message: `"userName":${req.body.userName} already exist` });

    user = await createUserService(req.body);

    res.cookie("accessjwt", user.generateAuthToken(), {
        secure: process.env.NODE_ENV == 'production' ? true : false,
        path: "/",
        httpOnly: true,
        sameSite: 'strict'
    })

    return res.status(201).send({ message: "register succesfully", user: _.omit(user.toObject(), 'password') });

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
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details);

    let user = await getUserService({ userName: req.body.userName });
    if (!user) return res.status(404).send({ path: "email or password", message: 'Incorrect username or password' })
    
    let isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) return res.status(404).send({ path: "email or password", message: 'Incorrect username or password' })

    res.cookie("accessjwt", user.generateAuthToken(), {
        secure: process.env.NODE_ENV == 'production' ? true : false,
        path: "/",
        httpOnly: true,
        sameSite: 'strict'
    })

    return res.status(200).send({ message: "login successfully", user: _.omit(user.toObject(), 'password') });

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


    const { error } = create_updateUserValidation(req.body, true);
    if (error) return res.status(400).send(error.details);
    let user: any;
    if (req.body.userName && req.body.userName !== req.user?.userName) {
        user = await getUserService({ userName: req.body.userName })
        if (user) return res.status(400).send({ path: "userName", message: `"userName":${req.body.userName} already exist try one else` });
    }

    user = await updateUserService({ userName: req.user.userName }, {$set: req.body});

    res.cookie("accessjwt", user.generateAuthToken(), {
        secure: process.env.NODE_ENV == 'production' ? true : false,
        path: "/",
        httpOnly: true,
        sameSite: 'strict'
    })

    return res.status(201).send({ message: "user updated succesfully", user: _.omit(user.toObject(), 'password') });


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
