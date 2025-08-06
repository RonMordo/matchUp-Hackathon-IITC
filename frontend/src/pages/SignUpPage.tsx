import RegisterForm from "@/components/forms/RegisterForm";
import { Link } from "react-router";
import { Sparkles } from "lucide-react";

export function RegistrationPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-8 bg-gradient-to-br from-[#c2e9fb] via-[#a1c4fd] to-[#d4fc79] dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] overflow-hidden">
      <div className="absolute -z-10 w-[1000px] h-[1000px] bg-purple-300/20 dark:bg-indigo-800/30 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-3xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-6 rounded-[2rem] shadow-2xl border border-white/40 dark:border-gray-800 transition-all duration-300">
        <div className="text-center mb-4">
          <Sparkles className="mx-auto h-10 w-10 text-indigo-600 dark:text-indigo-300" />
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-2">
            Create an Account
          </h1>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">Sign up and start your journey with us!</p>
        </div>

        <div className="transition duration-500 ease-in-out">
          <RegisterForm />
        </div>

        <div className="text-muted-foreground text-center text-xs text-balance mt-4">
          By creating an account, you agree to our{" "}
          <a href="#" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-3">
          Already signed up?{" "}
          <Link
            to="../signin"
            className="font-semibold text-indigo-600 dark:text-indigo-300 hover:underline transition-all duration-200 hover:text-indigo-700"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
