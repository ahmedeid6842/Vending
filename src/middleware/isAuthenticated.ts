import jwt, { JwtPayload } from 'jsonwebtoken';
import { getUserService } from '../services/user';
import { log } from '../utils/logger';
import { NextFunction, Request, Response } from 'express';

// this middleware to ensure that incoming request from authenticated user
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * DONE: check if access token is provided or not
   * DONE: verify the token
   * DONE: check if userId in jwt matching any user [in case user deleted and access token still valid]
   * DONE: check if access token is expired ,
   */

  try {
    const accessJWT = req.cookies['accessjwt'];
    if (!accessJWT)
      return res
        .status(400)
        .send({ path: 'Access Token', message: 'no token provided' });

    const decodedJWT = jwt.verify(
      accessJWT,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    const user = await getUserService({ userName: decodedJWT.userName });
    if (!user)
      return res.status(400).send({
        path: 'user',
        message: `"userName":${req.body.userName} not found`,
      });

    req.user = user;
    next();
  } catch (err: any) {
    if (err.message === 'jwt expired') {
      return res.status(440).send({
        path: 'Access Token',
        message: 'your session is expired, login again',
      });
    } else if (err.message == 'invalid signature') {
      return res
        .status(401)
        .send({ path: 'Access Token', message: 'invalid token provided' });
    } else {
      log.error(err);
      return res.status(500).send('something went wrong');
    }
  }
};
