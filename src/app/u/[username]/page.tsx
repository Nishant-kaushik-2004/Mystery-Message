"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { useCompletion } from "ai/react";
import DotsUpAndDownLoadingAnimation from "@/components/dotsUpDownLoading";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import ApiResponseType from "@/types/ApiResponseType";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function PublicProfilePage() {
  const defaultMsg1 = "What's a hobby you've recently started?";
  const defaultMsg2 =
    "If you could have dinner with any historical figure, who would it be and why?";
  const defaultMsg3 = "What's a simple thing that makes you happy?";

  const [msg1, setMsg1] = useState<string>(defaultMsg1);
  const [msg2, setMsg2] = useState<string>(defaultMsg2);
  const [msg3, setMsg3] = useState<string>(defaultMsg3);
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this:'What's a hobby you've recently started?| |If you could have dinner with any historical figure, who would it be?|l What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  const { completion, complete, error, isLoading } = useCompletion({
    api: "/api/suggest-messages",
  });

  const { toast } = useToast();

  const [message, setMessage] = useState("");

  const [isSendingMsg, setIsSendingMsg] = useState<boolean>(false);

  const { username } = useParams<{ username: string }>();

  const handleMessageSending = async () => {
    setIsSendingMsg(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        message,
      });

      if (response.status === 200) {
        toast({
          title: "Message sent successfully",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;

      const errorMsg = axiosError.response?.data.message;

      toast({
        title: "Failed to send message",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSendingMsg(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      localStorage.setItem("msg1", completion?.split("||")[0]?.slice(1) || "");
      localStorage.setItem("msg2", completion?.split("||")[1] || "");
      localStorage.setItem(
        "msg3",
        completion?.split("||")[2]?.slice(0, -1) || ""
      );
    }
    const message1 = localStorage.getItem("msg1") || null;
    if (message1) setMsg1(message1);

    const message2 = localStorage.getItem("msg2") || null;
    if (message2) setMsg2(message2);

    const message3 = localStorage.getItem("msg3") || null;
    if (message3) setMsg3(message3);
  }, [complete, isLoading, completion]);

  return (
    <div className="bg-white min-h-screen p-6 ">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Public Profile Link
        </h1>
        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold -mb-2">
            Send Anonymous Message to{" "}
            <span className="text-blue-500">@{username} 👋</span>
          </p>
          <form action={handleMessageSending} className="flex flex-col gap-2">
            <Textarea
              placeholder="Type your message here"
              className="!text-lg !active:outline-none"
              value={message}
              required={true}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              className="self-center text-lg max-w-min py-5 sm:py-6"
              type="submit"
            >
              {isSendingMsg ? <Loader2 className="animate-spin" /> : "Send It"}
            </Button>
          </form>
        </div>
        <Separator className="my-5" />
        <div className="flex flex-col justify-evenly mt-8 sm:mt-12 gap-10">
          <Button
            className="text-lg max-w-48 py-5 sm:py-6"
            onClick={() => {
              complete(prompt);
            }}
          >
            {isLoading ? <DotsUpAndDownLoadingAnimation /> : "Suggest Messages"}
          </Button>
          <p className="text-lg -mb-6">
            Click on any message below to select it.
          </p>
          <div className="flex flex-col gap-4 border p-6  rounded-lg">
            <h2 className="text-xl font-semibold">AI Generated Messages</h2>
            {error && (
              <p className="text-red-500 text-sm">{`${error.message}..${
                error.name
              } cause: ${
                error.cause !== "undefined" ? error.cause : "Free message "
              }`}</p>
            )}
            <div
              className="w-full border rounded-lg p-3 text-center text-lg hover:cursor-pointer"
              onClick={() => setMessage(msg1)}
            >
              {isLoading ? completion?.split("||")[0]?.slice(1) : msg1}
            </div>
            <div
              className="w-full border rounded-lg p-3 text-center text-lg hover:cursor-pointer"
              onClick={() => setMessage(msg2)}
            >
              {isLoading ? completion?.split("||")[1] : msg2}
            </div>
            <div
              className="w-full border rounded-lg p-3 text-center text-lg hover:cursor-pointer"
              onClick={() => setMessage(msg3)}
            >
              {isLoading ? completion?.split("||")[2]?.slice(0, -1) : msg3}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicProfilePage;
