"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import ApiResponseType from "@/types/ApiResponseType";
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
import { useRouter } from "next/navigation";
import React from "react";

export default function SignUp() {
  const [usernameMsg, setUsernameMsg] = useState<string | null>(null);
  const [isCheckingUsernameUnique, setIsCheckingUsernameUnique] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter(); //ye dhyan rakhna h ki useRouter next/navigation se imported ho naa ki next/router, next/router wala pages(nextjs 13 or earlier) version me use hota h.

  const { toast } = useToast();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const debouncedUsername = useDebounce(form.watch("username"), 500);

  useEffect(() => {
    if (debouncedUsername.length < 3) {
      return;
    }
    const checkUsernameUnique = async () => {
      setIsCheckingUsernameUnique(true);
      setUsernameMsg(null);
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`
        );
        setUsernameMsg(response.data.message);
        // console.log(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponseType>;
        setUsernameMsg(
          axiosError.response?.data.message || "Error checking Username"
        );
      } finally {
        setIsCheckingUsernameUnique(false);
      }
    };

    if (debouncedUsername) {
      checkUsernameUnique();
    }
  }, [debouncedUsername]);

  const OnSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      console.log(response);

      toast({
        title: "Signup successfull",
        description: response.data.message,
      });

      router.replace(`/sign-in`);
    } catch (error) {
      console.log("Error in signup of user", error);

      const axiosError = error as AxiosError<ApiResponseType>;

      const errorMessage = axiosError.response?.data.message;

      console.log("axiosError -> ", axiosError);

      console.log("errorMessage -> ", errorMessage);

      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setUsernameMsg("");
  }, [debouncedUsername]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md sm:p-8 p-6 space-y-8 bg-white rounded-lg shadow-md mx-3 sm:mx-0">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold lg-text-5xl mb-4  sm:mb-8">
            Join Mystery Message
          </h1>
          <p className="mb-4 sm:mb-8">
            Sign up to start your anonymous adventure
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(OnSubmit)}
              className="space-y-3 sm:space-y-6"
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-left block text-md opacity-70 ">
                      Username
                    </FormLabel>
                    <div className="flex relative">
                      <FormControl>
                        <Input
                          autoComplete="name"
                          placeholder="Enter a username"
                          {...field}
                        />
                      </FormControl>
                      {isCheckingUsernameUnique && (
                        <Loader2 className="animate-spin absolute ml-[300px] sm:ml-80 mt-2" />
                      )}
                    </div>
                    <p
                      className={`text-left ml-2 text-sm ${
                        usernameMsg === "Username  available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMsg}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-left block text-md opacity-70">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                        type="password"
                        autoComplete="current-password"
                        placeholder="Set your account password"
                        {...field}
                      />
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
                  "Signup"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already a member?{" "}
              <Link
                href={"/sign-in"}
                className="text-blue-600 hover:text-blue-800"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
