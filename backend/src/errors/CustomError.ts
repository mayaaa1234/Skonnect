export default class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    //Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const createCustomError = (msg: string, statusCode: number) => {
  return new CustomError(msg, statusCode);
};
