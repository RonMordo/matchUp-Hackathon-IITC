import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "../forms/FormFieldWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";
import sideImage from "@/img/login.jpeg";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export function OtpVerificationForm({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess: () => void;
}) {
  const { login } = useAuth();
  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: OtpFormData) => {
    try {
      const res = await fetch(`http://localhost:3001/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, otpCode: data.otp }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      login(result.user.email, result.user.password);
      onSuccess();
    } catch (error: any) {
      form.setError("otp", { type: "manual", message: error.message });
    }
  };

  return (
    <Card className="overflow-hidden p-0 bg-transparent border-none shadow-none">
      <CardContent className="grid p-0 md:grid-cols-2 gap-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Enter Verification Code
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                We sent a 6-digit code to your phone
              </p>
            </div>

            <div className="grid gap-4">
              <FormFieldWrapper
                control={form.control}
                name="otp"
                label="Enter OTP"
                type="text"
                placeholder="6-digit code"
              />
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Form>

        <div className="bg-muted relative hidden md:block rounded-r-[2rem] overflow-hidden max-h-[350px]">
          <img
            src={sideImage}
            alt="Side visual"
            className="h-[350px] w-full object-cover dark:brightness-75 dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
  );
}
