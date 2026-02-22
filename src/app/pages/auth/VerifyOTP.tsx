import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";
import { Leaf } from "lucide-react";
import { toast } from "sonner";
import * as authService from "../../services/authService";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");

  // Email is stored in localStorage after a successful registration
  const email = localStorage.getItem("pendingEmail") ?? "";

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await authService.verifyOtp({ email, otpCode: otp });
      localStorage.removeItem("pendingEmail");
      if (data?.token) localStorage.setItem("accessToken", data.token);
      if (data?.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
      if (data?.email) localStorage.setItem("userEmail", data.email);
      if (data?.status) localStorage.setItem("userStatus", data.status);
      if (data?.role) localStorage.setItem("userRole", data.role);
      toast.success("Email verified successfully!");
      navigate("/user/health-data");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Verification failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("No email address found. Please register again.");
      return;
    }

    setResendLoading(true);
    try {
      await authService.resendOtp(email);
      toast.success("New OTP sent to your email");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Failed to resend OTP. Please try again.";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-lighter to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Leaf className="size-10 text-primary" />
            <span className="text-2xl font-bold">NutriFlow</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to your email address. Please enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button 
              onClick={handleVerify} 
              className="w-full" 
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify email"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
              </p>
              <Button variant="link" onClick={handleResend} className="p-0 h-auto" disabled={resendLoading}>
                {resendLoading ? "Sending..." : "Resend code"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
