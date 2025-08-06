import LoginForm from "@/components/forms/LoginForm";
import { Link } from "react-router";
import { Sparkles } from "lucide-react";

export function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-8 bg-gradient-to-br from-[#c2e9fb] via-[#a1c4fd] to-[#d4fc79] dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] overflow-hidden">
      <div className="absolute -z-10 w-[1000px] h-[1000px] bg-purple-300/20 dark:bg-indigo-800/30 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-3xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-6 rounded-[2rem] shadow-2xl border border-white/40 dark:border-gray-800 transition-all duration-300">
        <div className="text-center mb-4">
          <Sparkles className="mx-auto h-10 w-10 text-indigo-600 dark:text-indigo-300" />
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-2">Welcome Back!</h1>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">Sign in to access your dashboard.</p>
        </div>

        <div className="transition duration-500 ease-in-out">
          <LoginForm />
        </div>

        <div className="text-muted-foreground text-center text-xs text-balance mt-4">
          By logging in, you agree to our{" "}
          <a href="#" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 pb-2 mt-3">
          Didn't sign up yet?{" "}
          <Link
            to="../signup"
            className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline transition-all duration-200 hover:text-indigo-700"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
