"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
// import { signIn } from "../../../auth";  // do not use this(from auth.ts in the root) signIn method as it can only be used in server components not in client components.
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";

const SignInComponent = () => {
  const [usernameMsg, setUsernameMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const OnSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.ok) {
      toast({
        title: "Logged in successfully",
      });
    }
    setIsSubmitting(false);
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const errorType = searchParams.get("error");

    if (errorType) {
      setTimeout(() => {
        const errorMsg =
          errorType === "CredentialsSignin"
            ? "Invalid id or password, Please enter correct credentials"
            : "Something went wrong, Please enable cookies to ensure site functions properly";
        toast({
          title: "Login failed",
          description: errorMsg,
          variant: "destructive",
        });
        setUsernameMsg(errorMsg);
      }, 200);
    }
  }, [searchParams]);

  const identifierValue = form.watch("identifier");
  const passwordValue = form.watch("password");

  useEffect(() => {
    setUsernameMsg("");
  }, [identifierValue, passwordValue]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md sm:p-8 p-6 sm:mx-0 mx-3 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold lg-text-5xl mb-4">
            Welcome Back to Mystery Message
          </h1>
          <p className="mb-4 sm:mb-8">
            Log in to start your anonymous adventure
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(OnSubmit)}
              className="space-y-3 sm:space-y-6"
            >
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-left block text-md opacity-70 ">
                      Email / Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="text"
                        placeholder="Enter your email or username"
                        {...field}
                      />
                    </FormControl>
                    {usernameMsg && (
                      <p
                        className={"flex text-sm text-red-500 text-start gap-1"}
                      >
                        <span className="text-lg mt-[2px]">
                          <FiAlertCircle />
                        </span>
                        {usernameMsg}
                      </p>
                    )}
                    <FormMessage className="text-left pl-2" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-left block text-md opacity-70">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="password"
                        placeholder="Enter your Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left pl-2" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="group sm:text-lg hover:shadow-sm px-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Please wait
                  </>
                ) : (
                  <>
                    Log in{" "}
                    <span className="group-hover:translate-x-2 transition-all duration-300">
                      <FaArrowRightLong />
                    </span>
                  </>
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Not reristered yet ?{" "}
              <Link
                href={"/sign-up"}
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap SignInComponent in Suspense
const SignIn = () => (
  <Suspense fallback={<div className="md:text-3xl mx-auto mt-32">Loading...</div>}>
    <SignInComponent />
  </Suspense>
);

export default SignIn;
