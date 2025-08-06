import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { useAuth } from "./AuthContext";
//import sideImage from "../img/image.png";

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

      // ציפייה לתשובה מהשרת: { requiresOtp, userId }
      const { requiresOtp, userId } = responseData;
      form.reset();
      onSuccess({ requiresOtp, userId });

    } catch (error: any) {
      form.setError("email", { type: "manual", message: error.message });
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-[44%]">
          {/* <img
            src={sideImage}
            alt="Create account"
            className="h-52 md:h-full w-full object-cover"
            loading="lazy"
          /> */}
          <div className="absolute top-6 left-6 hidden md:flex flex-col gap-3">
            <div className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-xs font-medium">
              🔒 Secure by design
            </div>
            <div className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-xs font-medium">
              ⚡ 2‑minute setup
            </div>
          </div>
        </div>

        <div className="md:w-[56%] bg-white dark:bg-gray-900 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Create a New Account
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            It’s quick and free.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormFieldWrapper
                control={form.control}
                name="name"
                label="Full Name"
                type="text"
                placeholder="Enter your name"
                description="At least 4 characters"
              />

              <FormFieldWrapper
                control={form.control}
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
              />

              <FormFieldWrapper
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                placeholder="05XXXXXXXX"
                description="Optional, must be Israeli format"
              />

              <FormFieldWrapper
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Create a strong password"
                description="6+ chars, 1 uppercase, 1 lowercase, 1 number"
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full py-3 text-base font-semibold"
              >
                {form.formState.isSubmitting ? "Registering..." : "Create account"}
              </Button>

              <div className="flex items-center justify-center gap-4 pt-1 text-xs text-gray-500">
                <span className="px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                  No spam
                </span>
                <span className="px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                  Cancel anytime
                </span>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
