import AppErrorCode from '../constants/appErrorCode';
import { HttpStatusCode } from '../constants/http';

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    // Error Class 에서 메시지 가져옴
    super(message);
  }
}

export default AppError;
