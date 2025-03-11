//export {};

//declare global {
//  namespace Express {
//    interface Request {
//      user?: {
//        id: string;
//        email: string;
//        isAdmin: boolean;
//      };
//    }
//  }
//}
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      isAdmin: boolean;
    };
  }
}
