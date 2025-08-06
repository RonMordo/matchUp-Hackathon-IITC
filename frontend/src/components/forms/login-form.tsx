"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import sideImage from "@/img/login.jpeg";



type Props = {
  onSwitchToRegister?: () => void;
};

export function LoginForm({ onSwitchToRegister }: Props) {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPassword) {
      setOtpStep(true);
      setUserId("mock-user-id");
    } else {
      console.log("Login...");
    }
  };

  if (otpStep && userId) {
    return (
      <OtpVerificationForm userId={userId} onSuccess={() => setOtpStep(false)} />
    );
  }

  return (
  <div className="w-full flex justify-center">
    <Card className="overflow-hidden p-0 shadow-2xl w-full max-w-4xl min-h-[550px]">
      <CardContent className="grid p-0 md:grid-cols-2 h-full">
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              {forgotPassword
                ? "Enter your phone number to reset password"
                : "Login to your account"}
            </p>
          </div>

          {forgotPassword ? (
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+972501234567"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-sm text-right text-blue-600 hover:underline mt-2"
                >
                  login with phone?
                </button>
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            {forgotPassword ? "Send OTP" : "Login"}
          </Button>

          <div className="relative text-center">
            <span className="bg-white dark:bg-gray-900 px-2 text-sm text-muted-foreground z-10 relative">
              Or continue with
            </span>
            <div className="absolute inset-0 border-t border-gray-300 dark:border-gray-700 top-1/2 -z-0" />
          </div>

          <Button variant="outline" type="button" className="w-full flex items-center justify-center gap-2">
            <FcGoogle size={20} />
            Login with Gmail
          </Button>

          <div className="text-center text-sm">
            Don’t have an account?{" "}
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={onSwitchToRegister}
            >
              Sign up
            </button>
          </div>
        </form>

        {/* Side image */}
        <div className="relative hidden md:block">
          <img
            src={sideImage}
            alt="Side visual"
            className="h-full w-full object-cover dark:brightness-75 dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

}
