import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { RefreshAccessTokenRequest } from 'server/models/App.model';
import {
  getRefreshToken,
  logout,
  refreshAccessToken,
} from 'server/services/App.service';
import { verifyToken } from 'server/utils/jwt.util';

export const refreshAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization =
    (req.query['authorization'] as string) ||
    (req.headers['authorization'] as string);

  const cancelAuth = async (id: string) => {
    req.query['authorization'] = '';
    req.headers['authorization'] = '';
    await logout(id);
  };

  if (authorization) {
    const accessToken = authorization.split(' ')[1];
    if (accessToken) {
      const verifiedAccessToken = verifyToken(accessToken);

      //   Only Refresh when Access Token has expired
      if (verifiedAccessToken.expired) {
        const decoded: any = decode(accessToken);
        if (decoded) {
          // Get refresh token
          const refreshToken = await getRefreshToken({
            id: decoded.token,
            userId: decoded.user,
            valid: true,
          });

          if (refreshToken) {
            //   Verify refresh token
            const verifiedRefreshToken = verifyToken(refreshToken.token);
            //  When refresh token have not expired ... refresh access token
            if (!verifiedRefreshToken.expired) {
              const refreshedToken = await refreshAccessToken(
                new RefreshAccessTokenRequest(
                  refreshToken.id,
                  refreshToken.userId,
                  decoded.type
                )
              );
              req.query['authorization'] = refreshedToken;
              req.headers['authorization'] = refreshedToken;
              res.setHeader('x-refresh', refreshedToken);
              global.localStorage.setItem('x-access', refreshedToken);
            } else {
              await cancelAuth(refreshToken.id);
            }
          } else {
            await cancelAuth(decoded.token);
          }
        }
      }
    }
  }
  next();
};
