import { useState } from "react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import { FormFieldWrapper } from "./forms/FormFieldWrapper";
import { Card, CardContent } from "./ui/card";
import { FcGoogle } from "react-icons/fc";
import { OtpVerificationForm } from "./auth/OtpVerificationForm";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import sideImage from "@/img/login.jpeg";

const loginSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    phoneNumber: z
      .string()
      .regex(/^05\d{8}$/, "Phone number must be Israeli (e.g. 05XXXXXXXX)")
      .optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "Either email or phone number is required",
    path: ["email"],
  });
type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "Johny@gmail.com",
      password: "John12345",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (forgotPassword) {
        setOtpStep(true);
        setUserId("mock-user-id");
      } else {
        console.log("Login with:", data);
        const email = data.email || "";
        const password = data.password;
        const isLoggedin = await auth.login(email, password);
        if (isLoggedin) {
          navigate("/");
        }
      }
      form.reset();
    } catch (error: any) {
      form.setError("email", { type: "manual", message: error.message });
    }
  };

  if (otpStep && userId) {
    return <OtpVerificationForm userId={userId} onSuccess={() => setOtpStep(false)} />;
  }

  return (
    <Card className="overflow-hidden p-0 bg-transparent border-none shadow-none">
      <CardContent className="grid p-0 md:grid-cols-2 gap-0 min-h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-3">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {forgotPassword ? "Reset Password" : ""}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {forgotPassword ? "Enter your phone number to reset password" : ""}
              </p>
            </div>

            <div className="grid gap-3">
              {forgotPassword ? (
                <FormFieldWrapper
                  control={form.control}
                  name="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  placeholder="05XXXXXXXX"
                />
              ) : (
                <>
                  <FormFieldWrapper
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="m@example.com"
                  />
                  <FormFieldWrapper
                    control={form.control}
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-sm text-left text-indigo-600 dark:text-indigo-300 hover:underline mt-2"
                  >
                    login with phone?
                  </button>
                </>
              )}
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {form.formState.isSubmitting ? "Processing..." : forgotPassword ? "Send OTP" : "Login"}
            </Button>

            <div className="relative text-center mt-6 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-900 px-4 py-1 text-gray-500 dark:text-gray-400 font-medium rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                  Or continue with
                </span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 py-3">
              <FcGoogle size={20} />
              Login with Google
            </Button>
          </form>
        </Form>

        <div className="bg-muted relative hidden md:flex rounded-r-[2rem] overflow-hidden">
          <img
            src={sideImage}
            alt="Side visual"
            className="h-full w-full object-cover dark:brightness-75 dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
