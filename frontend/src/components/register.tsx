import { useState } from "react";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { FormFieldWrapper } from "./forms/FormFieldWrapper";
import { Card, CardContent } from "./ui/card";
import { OtpVerificationForm } from "./auth/OtpVerificationForm";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import sideImage from "@/img/login.jpeg";
import { AuthService } from "@/services";

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, { message: "Email is required" }),
  phoneNumber: z
    .string()
    .regex(/^05\d{8}$/, "Phone number must be Israeli (e.g. 05XXXXXXXX)")
    .min(1, { message: "Phone number is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number"),
});

type RegisterSchema = z.infer<typeof registerSchema>;

function RegisterForm() {
  const navigate = useNavigate();
  const [otpStep, setOtpStep] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const registerMutation = useMutation({
    mutationFn: async (values: RegisterSchema) => {
      const res = await AuthService.register({
        name: values.name,
        email: values.email,
        phone: values.phoneNumber,
        password: values.password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      console.log("✅ Registration successful", data);
      const { requiresOtp, userId } = data;
      if (requiresOtp) {
        setOtpStep(true);
        setUserId(userId);
      } else {
        navigate("/");
      }
    },
    onError: (err: any) => {
      form.setError("email", { type: "manual", message: err?.response?.data?.message || "Registration failed" });
    },
  });

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "John Doe",
      email: "Johny@gmail.com",
      phoneNumber: "0512345678",
      password: "John12345",
    },
  });

  async function onSubmit(values: RegisterSchema) {
    await registerMutation.mutateAsync(values);
  }

  const handleOtpSuccess = () => {
    setOtpStep(false);
    navigate("/");
  };

  if (otpStep && userId) {
    return <OtpVerificationForm userId={userId} onSuccess={handleOtpSuccess} />;
  }

  return (
    <Card className="overflow-hidden p-0 bg-transparent border-none shadow-none">
      <CardContent className="grid p-0 md:grid-cols-2 gap-0 min-h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-3">
            <div className="grid gap-3">
              <FormFieldWrapper
                control={form.control}
                name="name"
                label="Full Name"
                type="text"
                placeholder="Enter your name"
              />
              <FormFieldWrapper
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
              <FormFieldWrapper
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                placeholder="05XXXXXXXX"
              />
              <FormFieldWrapper
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
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
              Sign up with Google
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

export default RegisterForm;