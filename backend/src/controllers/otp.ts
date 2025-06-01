import type { Request, Response } from "express";
import Otp from "../models/Otp.ts";
import { otpRequest as requestOtp } from "services/otpService.ts";
import mkCustomError from "../errors/CustomError.ts";
import { OtpRecord, OtpRecordAndResendStatus } from "../models/Otp.ts";

const getOtpInfo = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    mkCustomError({ status: 404, msg: "getOtpInfo: email not found" });

  const otpRecordAndResendStatus: OtpRecordAndResendStatus | null =
    await Otp.getOtpRecordByEmail(email);
  if (!otpRecordAndResendStatus)
    mkCustomError({ status: 404, msg: "OTP record by email not found" });

  // console.log({ otpRecordAndResendStatus });
  res.status(200).json(otpRecordAndResendStatus);
};
// const otpInfo = otpRequest(email);
// res.status(200).json({ otpInfo });

const otpRequest = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) throw mkCustomError({ status: 404, msg: "email not found" });

  const otp: OtpRecord = await requestOtp(email);
  // if (!otp) throw mkCustomError({ status: 500, msg: "error sending otp" });

  res.status(200).json(otp);
};

// const otpVerify = async (req: Request, res: Response): Promise<void> => {
//   const { otp, email } = req.body;
//   if (!otp || !email) {
//     console.log({ email, otp });
//     throw mkCustomError({ status: 404, msg: "email or otp not found" });
//   }
//
//   const verified = await Otp.verify(email, otp);
//   if (!verified) {
//     throw mkCustomError({
//       status: 401,
//       msg: "otp verification is not wrong, please try again",
//     });
//   }
//   res.sendStatus(200);
// };
//
// export { getOtpInfo, otpRequest, otpVerify };
export { getOtpInfo, otpRequest };
