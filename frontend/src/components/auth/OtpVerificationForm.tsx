import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "../forms/FormFieldWrapper";
import { useAuth } from "../../context/AuthContext";

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

      login(result.user);
      onSuccess();
    } catch (error: any) {
      form.setError("otp", { type: "manual", message: error.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFieldWrapper
          control={form.control}
          name="otp"
          label="Enter OTP"
          type="text"
          placeholder="6-digit code"
        />
        <Button type="submit" className="w-full">
          Verify OTP
        </Button>
      </form>
    </Form>
  );
}
