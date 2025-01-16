"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useToast } from "@/hooks/use-toast";
import { verifyCodeSchema } from "@/schemas/verifySchema";
import ApiResponseType from "@/types/ApiResponseType";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IoIosArrowRoundForward } from "react-icons/io";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type ParamType = {
  username: string;
};

export default function VerifyAccount() {
  const [verificationMsg, setVerificationMsg] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const { username } = useParams<ParamType>();

  const { toast } = useToast();

  //zod implementation
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      otp: "",
    },
  });

  const OnSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
    setIsSubmitting(true);
    try {
      setVerificationMsg("");

      const response = await axios.post(`/api/verify-code`, {
        username,
        otp: data.otp,
      });

      setVerificationMsg(response.data.message);

      console.log("response -> ", response);

      toast({ title: "Account Verified", description: response.data.message });

      router.replace("/sign-in");
    } catch (error) {
      console.log("Error in signup of user", error);

      const axiosError = error as AxiosError<ApiResponseType>;

      const errorMessage = axiosError.response?.data.message;

      setVerificationMsg(errorMessage || "Verification failed");

      toast({
        title: "Account verification failed!",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const otpFieldValue = form.watch("otp");

  useEffect(() => {
    setVerificationMsg("");
  }, [otpFieldValue]);

  const reSignUpMsg =
    "Your OTP has expired, Please signup again to generate a new one. ";

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg-text-5xl mb-8">
              Verify Your Account
            </h1>
            <p className="mb-8">Enter the otp sent to your email</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(OnSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="otp"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-4 items-center">
                          <div>
                            <FormLabel className="text-left block text-lg opacity-70 mb-3">
                              OTP
                            </FormLabel>
                            <InputOTP
                              maxLength={6}
                              {...field}
                              containerClassName="text-xl"
                              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                          <p
                            className={`text-sm pl-2 ${
                              verificationMsg ===
                              "Your account verified successfully"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {`${verificationMsg} `}
                            {verificationMsg === reSignUpMsg && (
                              <Link
                                href="/sign-up"
                                className="text-blue-500 flex justify-end items-center"
                              >
                                sign up
                                <IoIosArrowRoundForward />
                              </Link>
                            )}
                          </p>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="sm:text-lg hover:shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Please wait
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
