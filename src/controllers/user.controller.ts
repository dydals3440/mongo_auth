import { Request, Response } from 'express';

import { NOT_FOUND, OK } from '../constants/http';
import UserModel from '../models/user.model';
import appAssert from '../utils/appAssert';

export const getUserHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.userId);

  appAssert(user, NOT_FOUND, 'User not found');
  res.status(OK).json(user.omitPassword());
};
