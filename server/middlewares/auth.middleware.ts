import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { AppRequest } from 'server/models/App.model';
import { UserType } from 'server/models/Enums';
import { getUser } from 'server/services/User.service';
import * as cookie from 'cookie';

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization =
    (req.query['authorization'] as string) ||
    (req.headers['authorization'] as string);
  console.log('ENSURE AUTH:: ' + authorization, typeof authorization);

  if (!authorization || authorization === 'undefined') {
    return res.status(401).send('Unauthorize');
  }
  return next();
};

export const ensureIsTeacher = (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user || user.type !== UserType.Teacher)
    return res.status(401).send('Unauthorized');
  return next();
};

export const ensureIsAdmin = (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user || user.type !== UserType.Admin)
    return res.status(401).send('Unauthorized');
  return next();
};

export const ensureIsStudent = (
  req: AppRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user || user.type !== UserType.Student)
    return res.status(401).send('Unauthorized');
  return next();
};
