"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { CiLogout } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/app/redux/hook";
import { useDispatch } from "react-redux";
import { setProfile } from "@/app/redux/features/profileSlice";
import axios, { AxiosError } from "axios";
import ApiResponseType from "@/types/ApiResponseType";
import { toast } from "@/hooks/use-toast";
import { User } from "@/models/user.model";
import { useCallback, useEffect, useState } from "react";
import whatsapp_logo from "@/assets/whatsapp logo.png";
import facebook_logo from "@/assets/facebook logo.png";
import twitter_logo from "@/assets/twitter logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserPenIcon } from "lucide-react";
import { FcInvite } from "react-icons/fc";

export default function Navbar() {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);

  const [baseUrl, setBaseUrl] = useState("");

  const profile = useAppSelector((state) => state.profile);

  const dispatch = useDispatch();

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponseType>("/api/user-profile");
      dispatch(setProfile(response.data.userProfile as User));
    } catch (error) {
      console.log("Error while fetching user profile:", error);
      const axiosError = error as AxiosError<ApiResponseType>;
      const errorMsg = axiosError.response?.data.message;
      toast({
        title: "Error fetching profile updates",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session, fetchUserProfile]);

  const currentPagePathname = usePathname();

  // if (typeof window !== "undefined") {
  //   setBaseUrl(`${window.location.protocol}//${window.location.host}`);
  //   console.log("Base URL:", baseUrl);
  // }

  useEffect(() => {
    setBaseUrl(`${window.location.protocol}//${window.location.host}`);
  }, []);

  const homePageUrl = `${baseUrl}`;

  const url = encodeURIComponent(homePageUrl);

  const text = encodeURIComponent(
    `Hi, Check out this amazing Mystery Messaging website and have some fun.
    Here you can share your profile link in public so that others can send you Anonymous messages mysteriously as you won't be able to see who really they are.
    Website link - `
  );

  useEffect(() => {
    setOpen(false);
  }, [currentPagePathname]);

  return (
    <nav className="py-2 px-5 md:p-6 shadow-md sticky top-0 bg-white z-10">
      <div className="sm:px-6 container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-12">
          <a
            href="/"
            className="text-xl font-bold hover:text-gray-700 duration-200"
          >
            Mystery Message
          </a>
          <a
            href="/dashboard"
            className="text-lg  mb-4 md:mb-0 hidden md:block hover:text-gray-600 duration-200"
          >
            Dashboard
          </a>
          <a
            href="/my-profile"
            className="text-lg  mb-4 md:mb-0 hidden md:block hover:text-gray-600 duration-200"
          >
            Profile
          </a>
        </div>
        {session ? (
          <>
            <span className="mr-4 hidden sm:block">
              Welcome, {profile.username || profile.email}
            </span>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="h-12 w-12 rounded-full sm:hover:scale-110 duration-300 transition-all"
                >
                  <Avatar>
                    <AvatarImage
                      src={profile.imageUrl || "https://github.com/shadcn.png"}
                      alt="User avatar"
                    />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="sm:min-w-60 sm:mr-16 mr-5 p-2 relative">
                <DropdownMenuLabel>
                  <span className="font-normal text-gray-600">
                    Signed in as{" "}
                  </span>
                  {profile.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className={`${currentPagePathname === "/" && "hidden"}`}
                  >
                    {currentPagePathname === "/dashboard" ? (
                      <Link
                        className="font-medium w-full flex gap-2 items-center"
                        href={"/my-profile"}
                      >
                        {" "}
                        <UserPenIcon className="text-blue-500" /> Profile
                      </Link>
                    ) : (
                      <Link
                        className="font-medium w-full flex gap-2 items-center"
                        href={"/dashboard"}
                      >
                        {" "}
                        <LayoutDashboard className="text-blue-500" /> Dashboard
                      </Link>
                    )}
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`${currentPagePathname !== "/" && "hidden"}`}
                  >
                    <Link
                      className="font-medium w-full flex gap-2 items-center"
                      href={"/dashboard"}
                    >
                      {" "}
                      <LayoutDashboard className="text-blue-500" /> Dashboard
                    </Link>
                    <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`${currentPagePathname !== "/" && "hidden"}`}
                  >
                    <Link
                      className="font-medium w-full flex gap-2 items-center"
                      href={"/my-profile"}
                    >
                      {" "}
                      <UserPenIcon className="text-blue-500" /> Profile
                    </Link>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span className="font-medium flex items-center gap-2"><FcInvite />Invite users</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="sm:static absolute -left-28 top-10">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <a
                            href={`https://wa.me/?text=${text} ${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mx-auto -mb-2"
                          >
                            <Image
                              alt="whatsapp logo"
                              src={whatsapp_logo}
                              height={60}
                              width={60}
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
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant={"destructive"}
                    className="px-3 w-full max-w-28"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <span className="text-xl">
                      <CiLogout />
                    </span>
                    Logout
                  </Button>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
