import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import sideImage from "@/img/login.jpeg";

const registerSchema = z
  .object({
    name: z.string().min(4, "Name must be at least 4 characters"),
    email: z.string().email("Invalid email address").optional(),
    phoneNumber: z
      .string()
      .regex(/^05\d{8}$/, "Phone number must be Israeli (e.g. 05XXXXXXXX)")
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[a-z]/, "Must contain lowercase")
      .regex(/[0-9]/, "Must contain number"),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "Either email or phone number is required",
    path: ["email"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  onSuccess: (result: { requiresOtp: boolean; userId: string }) => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || "Registration failed");

      const { requiresOtp, userId } = responseData;
      form.reset();
      onSuccess({ requiresOtp, userId });
    } catch (error: any) {
      form.setError("email", { type: "manual", message: error.message });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <h1 className="text-xl font-bold">Create Account</h1>
                <p className="text-sm text-muted-foreground">
                  Sign up and join our platform
                </p>
              </div>

              <Form {...form}>
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
                    placeholder="you@example.com"
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
                    placeholder="Create a strong password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full mt-2"
                >
                  {form.formState.isSubmitting ? "Registering..." : "Create account"}
                </Button>
              </Form>

              <div className="relative text-center mt-2 mb-1">
                <span className="bg-white dark:bg-gray-900 px-2 text-sm text-muted-foreground z-10 relative">
                  Or continue with
                </span>
                <div className="absolute inset-0 border-t border-gray-300 top-1/2 -z-0" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <FcGoogle size={20} />
                Sign up with Google
              </Button>

              <div className="text-center text-sm mt-1">
                Already have an account?{" "}
                <a href="#" className="underline">
                  Log in
                </a>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src={sideImage}
              alt="Side visual"
              className="h-full w-full object-cover dark:brightness-75 dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
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
    </div>
  );
}
