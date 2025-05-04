import { RequestHandler } from 'express';
import appAssert from '../utils/appAssert';
import AppErrorCode from '../constants/appErrorCode';
import { UNAUTHORIZED } from '../constants/http';
import { AccessTokenPayload, verifyToken } from '../utils/jwt';
import { ObjectId } from 'mongoose';

// wrap with catchErrors() if you need this to be async
const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    'Not authorized',
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken<AccessTokenPayload>(accessToken);

  appAssert(
    payload,
    UNAUTHORIZED,
    error === 'jwt expired' ? 'Token expired' : 'Invalid token',
    AppErrorCode.InvalidAccessToken
  );

  /* eslint-disable @typescript-eslint/no-explicit-any */
  req.userId = payload.userId as any;
  req.sessionId = payload.sessionId as any;
  next();
};

export default authenticate;
