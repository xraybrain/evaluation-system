import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { AppRequest } from 'server/models/App.model';
import { getUser } from 'server/services/User.service';

export const deserializeUser = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization =
    (req.query['authorization'] as string) ||
    (req.headers['authorization'] as string);
  if (authorization) {
    const accessToken = authorization.split(' ')[1];
    const decoded: any = decode(accessToken);
    if (decoded) {
      req.user = await getUser({ id: decoded.user });
    }
  }

  next();
};
