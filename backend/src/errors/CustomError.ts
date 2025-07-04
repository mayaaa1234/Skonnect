export class CustomError extends Error {
  statusCode: number;
  public errors?: { [key: string]: string };

  constructor(
    statusCode: number,
    message?: string,
    errors?: { [key: string]: string }, // ths if server wants to send multiple err's
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const mkCustomError = ({
  status,
  errs,
  msg,
}: {
  status: number;
  errs?: { [key: string]: string };
  msg?: string;
}) => {
  return new CustomError(status, msg, errs);
};

//const mkCustomError = (
//  statusCode: number,
//  singleMessageErr?: string,
//  objectErr?: { [key: string]: string },
//) => {
//  return new CustomError(statusCode, singleMessageErr, objectErr);
//};

export default mkCustomError;
