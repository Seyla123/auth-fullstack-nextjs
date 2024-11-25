class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
  
      // Set the instance properties
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      // Capture the stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default AppError;
  