import { Request, Response } from 'express';
import SessionModel from '../models/session.model';
import { OK } from '../constants/http';

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
