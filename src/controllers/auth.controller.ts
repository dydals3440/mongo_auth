import { Request, Response } from 'express';
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
} from '../service/auth.service';
import { CREATED, OK, UNAUTHORIZED } from '../constants/http';
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from '../utils/cookies';
import { z } from 'zod';
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from './auth.schemas';
import { verifyToken } from '../utils/jwt';
import SessionModel from '../models/session.model';
import appAssert from '../utils/appAssert';
export const registerHandler = async (req: Request, res: Response) => {
  // Validate Request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });

  // Call Service
  const { user, accessToken, refreshToken } = await createAccount(request);
  // Return resposne
  setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json(user);
};

export const loginHandler = async (req: Request, res: Response) => {
  // Validate Request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });

  // Call Service
  const { accessToken, refreshToken } = await loginUser(request);
  // Return resposne
  setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json({
    message: 'Login successful',
  });
};

export const logoutHandler = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || '');

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  clearAuthCookies(res).status(OK).json({
    message: 'Logout successful',
  });
};

export const refreshHandler = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, 'Missing Refresh Token');

  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions());
  }

  res
    .status(OK)
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .json({
      message: 'Access Token Refreshed',
    });
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  res.status(OK).json({
    message: 'Email verified successfully',
  });
};

export const sendPasswordResetHandler = async (req: Request, res: Response) => {
  const email = emailSchema.parse(req.body.email);

  // call service
  await sendPasswordResetEmail(email);

  res.status(OK).json({
    message: 'Password reset email sent',
  });
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const request = resetPasswordSchema.parse(req.body);

  await resetPassword(request);

  clearAuthCookies(res).status(OK).json({
    message: 'Password reset successful',
  });
};
