import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// this middleware to ensure user will n't logged in if he already does
export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * DONE: check if no access token provided then move to next middleware
   * DONE: verify provided, if verfied then user is logged in else isn't.
   */
  try {
    const accessJWT = req.cookies['accessjwt'];

    if (!accessJWT) {
      return next();
    }

    const decodedJWT = jwt.verify(
      accessJWT,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    return res.status(400).send({
      message: `"userName": ${decodedJWT.userName} already login, try to logout first`,
    });
  } catch (err: any) {
    if (err.message === 'jwt expired') {
      return next();
    } else if (err.message == 'invalid signature') {
      return res
        .status(401)
        .send({ path: 'Access Token', message: 'invalid token provided' });
    }
    return res.send(err.message);
  }
};
