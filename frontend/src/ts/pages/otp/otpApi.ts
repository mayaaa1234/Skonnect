import { notifyError } from "@utils/showNotif.ts";
import { OtpInfo } from "@ts-pages/signup/signupValidation.ts";

interface OtpRecordAndResendStatus extends OtpInfo {
  cooldown: Date | null;
  request_count: number;
}

async function requestOtp(email: string): Promise<Response | null> {
  try {
    const response = await fetch("/api/v1/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    // if (!response.ok) {
    //   console.error("Server error:", response.status);
    //   notifyError("Request failed, please try again later.");
    //   return null;
    // }

    return response;
  } catch (error) {
    console.error("Network error:", error);
    notifyError("Something went wrong, please try again later.");
    return null;
  }
}

async function getOtpInfoByEmail(
  email: string,
): Promise<OtpRecordAndResendStatus | null> {
  try {
    const response = await fetch("/api/v1/otp/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Server error:", response.status);
      notifyError("Failed to retrieve OTP info.");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    notifyError("Something went wrong, please try again later.");
    return null;
  }
}

async function otpVerification(email: string, otp: string) {
  try {
    const response = await fetch("/api/v1/auth/signup/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });
    return response;
  } catch (error) {
    console.error("Network error:", error);
    notifyError("Something went wrong, please try again later.");
    return null;
  }
}
export { otpVerification, getOtpInfoByEmail, requestOtp };
