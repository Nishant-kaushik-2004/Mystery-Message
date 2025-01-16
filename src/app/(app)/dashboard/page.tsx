"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Message } from "@/models/user.model";
import axios, { AxiosError } from "axios";
import ApiResponseType from "@/types/ApiResponseType";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { Input } from "@/components/ui/input";
import { IoShareSocial } from "react-icons/io5";
import { FaCopy } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import whatsapp_logo from "@/assets/whatsapp logo.png";
import facebook_logo from "@/assets/facebook logo.png";
import twitter_logo from "@/assets/twitter logo.png";
import Image from "next/image";
import { useAppSelector } from "@/app/redux/hook";

function Dashboard() {
  const { data: session } = useSession();

  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("date");

  const profile = useAppSelector((state) => state.profile);

  const { register, setValue, watch } = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: true,
    },
  });

  const handleMessageDelete = (messageId: string) =>
    setMessages(messages.filter((msg) => msg._id !== messageId));

  const fetchSwitchState = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponseType>("/api/accept-messages");

      setValue("acceptMessages", response.data.isAcceptingMessages!);
      console.log(response.data);
    } catch (error) {
      console.log("Error in fetching switch state", error);

      const axiosError = error as AxiosError<ApiResponseType>;

      toast({
        title: "Error in fetching message accepting status",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponseType>("/api/get-messages");
        console.log(response.data);
        setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        console.log("Error in fetching latest messages", error);

        const axiosError = error as AxiosError<ApiResponseType>;

        toast({
          title: "Error in fetching",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch latest messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [setMessages, setLoading, toast]
  );

  useEffect(() => {
    if (session && session.user) {
      fetchMessages();
      fetchSwitchState();
    }
  }, [session, setValue, fetchSwitchState, fetchMessages]);

  const switchState = watch("acceptMessages");

  const handleSwitchToggle = async (checked: boolean) => {
    setValue("acceptMessages", checked);

    setIsSwitchLoading(true);

    try {
      const response = await axios.post<ApiResponseType>(
        "/api/accept-messages",
        {
          messageAcceptance: checked,
        }
      );

      console.log("handleSwitchTogggle", response.data);

      toast({
        title: "Status updated",
        description: response.data.message,
      });
    } catch (error) {
      console.log("Error in updating status", error);

      setValue("acceptMessages", !checked);

      const axiosError = error as AxiosError<ApiResponseType>;

      toast({
        title: "Error in updating status",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };
  // const handleSwitchToggle = (checked:boolean) => {
  //   console.log("Switch toggled:", checked);
  //   console.log("switchState",watch("acceptMessages"));
  // };

  if (!session || !session.user) {
    return (
      <>
        <p>You&apos;r Unauthorized</p>
        <p>Please login first</p>
      </>
    );
  }

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const profileUrl = `${baseUrl}/u/${profile.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);

    toast({
      title: "URL Copied",
      description: "Profile URL has been copied to your clipboard",
    });
  };

  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMessages = filteredMessages.sort((a, b) => {
    if (sortCriteria === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortCriteria === "content") {
      return a.content.localeCompare(b.content);
    }
    return 0;
  });

  const url = encodeURIComponent(profileUrl);
  const text = encodeURIComponent(
    `Hi, You can send me the mysterious messages by clicking this profile link of mine as your name won't be displayed to me.
    You too can try out this amazing Mystery Messaging website built by Nishant!
    Website link - ${baseUrl} 
    My profile link - `
  );

  return (
    <>
      <div className="bg-white shadow-md min-h-screen mx-4 md:mx-8 lg:mx-auto p-6 sm:p-12 pb-40 mb-3 sm:pb-40 rounded sm:w-full max-w-6xl flex flex-col gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold sm:mb-4 mb-2 sm:-mt-6 self-center">
          User Dashboard
        </h1>
        <div className="flex flex-col gap-8">
          <div className="">
            <h2 className="font-semibold mb-2">
              Copy Your Unique Link to share in Public
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 sm:mr-2"
              />
              <div className="flex self-end gap-3">
              <Button onClick={copyToClipboard} className="group">
                Copy
                <FaCopy className="sm:group-hover:scale-110 transition-all" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="group">
                    Share
                    <IoShareSocial className="sm:group-hover:scale-110 transition-all" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-5">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <a
                        href={`https://wa.me/?text=${text} ${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-auto"
                      >
                        <Image
                          alt="whatsapp logo"
                          src={whatsapp_logo}
                          height={30}
                          width={30}
                        />
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-auto"
                      >
                        <Image
                          alt="facebook logo"
                          src={facebook_logo}
                          height={30}
                          width={30}
                        />
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-auto"
                      >
                        <Image
                          alt="twitter logo"
                          src={twitter_logo}
                          height={30}
                          width={30}
                        />
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="flex">
            <Switch
              {...register("acceptMessages")}
              checked={switchState}
              onCheckedChange={handleSwitchToggle}
              disabled={isSwitchLoading}
            />
            <span className="ml-2">
              Accept Messages: {switchState ? "ON" : "OFF"}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-8">
          <h2 className="font-semibold text-lg mt-2">RECIEVED MESSAGES</h2>
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:min-w-96"
          />
          <div className=" flex justify-between items-center">
            <div className="flex justify-between items-center">
              <span className="mr-1 text-gray-700">Sort by:</span>
              <Select
                value={sortCriteria}
                onValueChange={(e) => setSortCriteria(e)}
              >
                <SelectTrigger className="w-[100px] flex items-center">
                  <SelectValue placeholder="Select date or content" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="self-end"
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="!h-5 !w-5" />
              )}
              <span className="font-semibold hidden sm:block">REFRESH</span>
            </Button>
          </div>

          {messages.length > 0 ? (
            filteredMessages.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 sm:gap-10 gap-6">
                {sortedMessages.map((msg) => (
                  <MessageCard
                    key={msg._id as string}
                    message={msg}
                    onMessageDelete={handleMessageDelete}
                  />
                ))}
              </div>
            ) : (
              <p>
                No messages found with the search query:{" "}
                <span className="font-semibold">{searchQuery}</span>
              </p>
            )
          ) : (
            <>
              <p className="font-thin mt-16 text-center text-2xl">
                No messages recieved yet to display!!
                <span role="img" aria-label="sad">
                  {" "}
                  😔
                </span>
              </p>
              <p className="text-center text-gray-500">
                Share your profile link with others to receive messages...
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
