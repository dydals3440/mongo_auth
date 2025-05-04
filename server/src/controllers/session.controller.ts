import { Request, Response } from 'express';
import SessionModel from '../models/session.model';
import { NOT_FOUND, OK } from '../constants/http';
import { z } from 'zod';
import appAssert from '../utils/appAssert';

export const getSessionHandler = async (req: Request, res: Response) => {
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      // 만료된 토큰은 제외
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );

  res.status(OK).json(
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        // 현재 세션인 경우
        // 현재 세션이 아닌 경우만 클라이언트에서 삭제 가능하게 함.
        isCurrent: true,
      }),
    }))
  );
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
  const sessionId = z.string().parse(req.params.id);
  // 유저를 체크 안하면, 어떤 유저든 세션을 삭제 가능해짐
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, 'Session not found');
  res.status(OK).json({
    message: 'Session deleted successfully',
  });
};
