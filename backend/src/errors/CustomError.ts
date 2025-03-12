export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    //when you extend a built-in class like Error, JavaScript does not automatically fix the prototype chain in all environments.
    // idk not needed in this case i guess
    //Object.setPrototypeOf(this, CustomError.prototype);
  }
}

const mkCustomError = (msg: string, statusCode: number) => {
  return new CustomError(msg, statusCode);
};

export default mkCustomError;
