import { useState } from "react";
import { LoginForm } from "../components/forms/LoginForm";
import { RegisterForm } from "../components/forms/RegisterForm";
import { OtpVerificationForm } from "../components/auth/OtpVerificationForm";
import { Button } from "@/components/ui/button";
import { Sparkles, LogIn, UserPlus } from "lucide-react";

type Step = "login" | "register" | "verifyOtp";

export function AuthPage() {
  const [step, setStep] = useState<Step>("register");
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-[#c2e9fb] via-[#a1c4fd] to-[#d4fc79] dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] overflow-hidden">
      {/* רקע עיגול גלואינג */}
      <div className="absolute -z-10 w-[1000px] h-[1000px] bg-purple-300/20 dark:bg-indigo-800/30 rounded-full blur-3xl animate-pulse" />

      {/* תיבת טופס */}
      <div className="w-full max-w-xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-10 rounded-[2rem] shadow-2xl border border-white/40 dark:border-gray-800 transition-all duration-300">
        <div className="text-center mb-10">
          <Sparkles className="mx-auto h-10 w-10 text-indigo-600 dark:text-indigo-300" />
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-2">
            {step === "login"
              ? "Welcome Back!"
              : step === "verifyOtp"
              ? "Verify Your Code"
              : "Create an Account"}
          </h1>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            {step === "login"
              ? "Sign in to access your dashboard."
              : step === "verifyOtp"
              ? "Enter the OTP you received by SMS"
              : "Sign up and start your journey with us!"}
          </p>
        </div>

        {/* Tabs */}
        {step !== "verifyOtp" && (
          <div className="flex mb-8 border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden bg-white dark:bg-gray-800 shadow-inner">
            <Button
              variant="ghost"
              className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 rounded-none ${
                step === "register"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setStep("register")}
            >
              <UserPlus size={16} />
              Register
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 rounded-none ${
                step === "login"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setStep("login")}
            >
              <LogIn size={16} />
              Login
            </Button>
          </div>
        )}

        {/* Form switch */}
        <div className="transition duration-500 ease-in-out">
          {step === "login" && (
            <LoginForm onSwitchToRegister={() => setStep("register")} />
          )}

          {step === "register" && (
            <RegisterForm
              onSuccess={({ requiresOtp, userId }) => {
                if (requiresOtp) {
                  setStep("verifyOtp");
                  setUserId(userId);
                } else {
                  setStep("login");
                }
              }}
            />
          )}

          {step === "verifyOtp" && userId && (
            <OtpVerificationForm
              userId={userId}
              onSuccess={() => setStep("login")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
