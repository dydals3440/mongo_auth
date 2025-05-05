import { RequestHandler } from 'express';
import appAssert from '../utils/appAssert';
import AppErrorCode from '../constants/appErrorCode';
import { UNAUTHORIZED } from '../constants/http';
import { AccessTokenPayload, verifyToken } from '../utils/jwt';
import SessionModel from '../models/session.model';

// wrap with catchErrors() if you need this to be async
const authenticate: RequestHandler = async (req, res, next) => {
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

  // TODO: Session 모델에서 세션 조회
  const session = await SessionModel.findById(payload.sessionId);
  appAssert(
    session && session.expiresAt > new Date(), // 세션이 존재하고 만료되지 않았는지 확인
    UNAUTHORIZED,
    'Session is invalid or expired',
    AppErrorCode.InvalidAccessToken // 또는 다른 적절한 에러 코드
  );

  /* eslint-disable @typescript-eslint/no-explicit-any */
  req.userId = payload.userId as any;
  req.sessionId = payload.sessionId as any;
  next();
};

export default authenticate;
