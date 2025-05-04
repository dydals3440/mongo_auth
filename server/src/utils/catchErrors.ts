import { NextFunction, Request, Response } from 'express';

// Express 5.0 에서는 자동으로 error를 next()로 넘겨주기떄문에 try/catch로 감싸주지않아도됨
type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const catchErrors =
  (controller: AsyncController) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default catchErrors;
