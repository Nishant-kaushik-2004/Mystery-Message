"use client";
import React, { useEffect, useState } from "react";
import { Camera, Loader2, Mail, MessageSquare, User, X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CldUploadWidget } from "next-cloudinary";
// import { getCldImageUrl } from "next-cloudinary";
import { CldImage } from "next-cloudinary";
import { useToast } from "@/hooks/use-toast";
import ApiResponseType from "@/types/ApiResponseType";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";
import { editProfileSchema } from "@/schemas/editProfileSchema";
import { z } from "zod";
import { changePasswordSchema } from "@/schemas/changePasswordSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { User as userType } from "@/models/user.model";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setProfile } from "@/app/redux/features/profileSlice";
import Image from "next/image";

const ProfilePage = () => {
  // const url = getCldImageUrl({
  //   width: 960,
  //   height: 600,
  //   src: "2nd_portfolio_profile_picture_ductx9",
  // });
  // console.log(url);
  // const [profilePicture, setProfilePicture] = useState<string>(
  //   "https://res.cloudinary.com/dhjmuh76h/image/upload/v1735928594/samples/cloudinary-icon.png"
  // );
  const [showSuccess, setShowSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState("");
  const [isCheckingUsernameUnique, setIsCheckingUsernameUnique] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  const { toast } = useToast();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = async (result: any) => {
    setIsSubmitting(true);
    if (result.event != "success") {
      toast({
        title: "Error uplaoding your avatar",
        variant: "destructive",
      });
    }
    try {
      await axios.post("/api/update-avatar", {
        imageUrl: result.info.secure_url,
      });
      setShowSuccess(true);
      toast({
        title: "Your avatar successfully updated",
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.log("Error updating avatar:", error);
      const axiosError = error as AxiosError<ApiResponseType>;
      const errorMsg = axiosError.response?.data.message;
      toast({
        title: "Error saving your avatar",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      fetchUserProfile();
    }
    // if (e.target.files && e.target.files[0]) {     // If not used cloudinary then the custom method would be reading image file using javascript.
    //   const file = e.target.files[0];
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setProfilePicture(reader.result as string);
    //   };
    //   reader.readAsDataURL(file);
    //   try {
    //     setLoading(true);
    //     const formData = new FormData();
    //     formData.append("avatar", file);

    //     await axios.post("/update-avatar", formData, {
    //       headers: { "Content-Type": "multipart/form-data" },
    //     });
    //     setShowSuccess(true);
    //     setTimeout(() => setShowSuccess(false), 3000);
    //   } catch (error) {
    //     console.error("Error updating avatar:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
  };

  const handleProfileUpdate = async (
    data: z.infer<typeof editProfileSchema>
  ) => {
    try {
      setIsSubmitting(true);

      const response = await axios.post<ApiResponseType>(
        "/api/update-profile",
        data
      );
      toast({
        title: response.data.message,
      });
      setIsOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.log("Error while updating your profile:", error);
      const axiosError = error as AxiosError<ApiResponseType>;
      const errorMsg = axiosError.response?.data.message;
      toast({
        title: "Error updating profile",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      fetchUserProfile();
    }
  };

  const handleSecurityUpdate = async (
    data: z.infer<typeof changePasswordSchema>
  ) => {
    try {
      setIsSubmitting(true);

      const response = await axios.post<ApiResponseType>(
        "/api/change-password",
        data
      );
      toast({
        title: response.data.message,
      });
      setIsOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.log("Error updating security:", error);
      const axiosError = error as AxiosError<ApiResponseType>;
      const errorMsg = axiosError.response?.data.message;
      toast({
        title: "Error updating password",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      fetchUserProfile();
    }
  };

  // Profile Form
  const profileForm = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: "",
      email: "",
      isAcceptingMessages: true,
    },
  });

  const debouncedUsername = useDebounce(profileForm.watch("username"), 500);

  useEffect(() => {
    if (debouncedUsername.length < 3) {
      return;
    }
    const checkUsernameUnique = async () => {
      setIsCheckingUsernameUnique(true);
      setUsernameMsg("");
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`
        );
        setUsernameMsg(response.data.message);
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

  useEffect(() => {
    setUsernameMsg("");
  }, [debouncedUsername]);

  // Security Form
  const securityForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get<ApiResponseType>("/api/user-profile");
      dispatch(setProfile(response.data.userProfile as userType));
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-3xl mx-auto p-4 sm:pt-4 pt-3">
        <div className="grid  sm:gap-4 gap-2">
          <div className="bg-white p-4 w-full mx-auto flex justify-center items-center rounded-md">
            <span className="text-xl font-bold text-blue-600">
              My Profile
            </span>
          </div>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="relative group">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-100 hover:border-blue-300 transition-all duration-300">
                  <CldImage
                    alt="Sample image"
                    priority
                    src={
                      profile.imageUrl ||
                      "https://res.cloudinary.com/dhjmuh76h/image/upload/v1736351826/shadcn_aswaea.jpg"
                    }
                    width="500" // Transform the image: auto-crop to square aspect_ratio
                    height="500"
                    onClick={() => setIsModalOpen(true)}
                    crop={{
                      type: "auto",
                      source: true,
                    }}
                  />
                  {/* Modal */}
                  {isModalOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex  justify-center p-4"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <div
                        className="relative mt-32 mb-96 md:mt-40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Close Button */}
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="absolute -right-8 -top-8 text-white hover:text-gray-200"
                        >
                          <X size={24} />
                        </button>

                        {/* Large Avatar */}
                        <div className="bg-white rounded-full overflow-hidden p-2 w-80 h-80 md:w-[500px] md:h-[500px] relative">
                          <Image
                            src={
                              profile.imageUrl ||
                              "https://res.cloudinary.com/dhjmuh76h/image/upload/v1736351826/shadcn_aswaea.jpg"
                            }
                            layout="fill"
                            alt="Profile"
                            objectFit="cover" // Optional for scaling behavior
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-1/3 md:right-[285px] bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors duration-300">
                  <CldUploadWidget
                    uploadPreset="profile_picture"
                    onSuccess={handleImageUpload}
                  >
                    {({ open }) => {
                      return (
                        <Camera
                          onClick={() => {
                            open();
                          }}
                          className="w-5 h-5 text-white"
                        />
                      );
                    }}
                  </CldUploadWidget>
                  {/* <input  //Used when we implemented custom uploading via image reading
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                  /> */}
                </label>
              </div>
              {showSuccess && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <AlertDescription>
                    Profile updated successfully!
                  </AlertDescription>
                </Alert>
              )}
              <h1 className="text-2xl font-bold text-center mt-4 mb-2">
                {profile.username}
              </h1>
              <p className="text-gray-500 text-center">
                User ID: {profile._id}
              </p>

              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                  <Button className="w-full mt-4">Edit Profile</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="mx-auto my-4">
                      Edit Profile
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 pb-4 mb-48 flex flex-col items-center h-80">
                    <Tabs
                      defaultValue="profile"
                      className="w-full md:max-w-[600px]"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                      </TabsList>
                      <TabsContent value="profile">
                        <Form {...profileForm}>
                          <form
                            onSubmit={profileForm.handleSubmit(
                              handleProfileUpdate
                            )}
                            className="space-y-6"
                          >
                            <FormField
                              name="username"
                              control={profileForm.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-left block text-md opacity-70 ">
                                    Username
                                  </FormLabel>
                                  <div className="flex relative">
                                    <FormControl>
                                      <Input
                                        placeholder="Enter new username"
                                        {...field}
                                      />
                                    </FormControl>
                                    {isCheckingUsernameUnique && (
                                      <Loader2 className="animate-spin text-blue-600 absolute ml-[300px] sm:ml-[500px] mt-2" />
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
                              control={profileForm.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-left block text-md opacity-70">
                                    Email
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="Enter email"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="isAcceptingMessages"
                              control={profileForm.control}
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                  <FormControl>
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="mt-2"
                                    />
                                  </FormControl>
                                  <FormLabel className="text-md">
                                    Accept Messages
                                  </FormLabel>
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
                                  <Loader2 className="mr-2 animate-spin" />{" "}
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                      <TabsContent value="security">
                        <Form {...securityForm}>
                          <form
                            onSubmit={securityForm.handleSubmit(
                              handleSecurityUpdate
                            )}
                            className="space-y-6"
                          >
                            <FormField
                              name="currentPassword"
                              control={securityForm.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-left block text-md opacity-70">
                                    Current Password
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Enter your current password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="newPassword"
                              control={securityForm.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-left block text-md opacity-70">
                                    New Password
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Enter new password"
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
                                  <Loader2 className="mr-2 animate-spin" />{" "}
                                  Updating...
                                </>
                              ) : (
                                "Update Password"
                              )}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                    </Tabs>
                  </div>
                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Details</h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <User className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{profile.username}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <Mail className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <MessageSquare className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Message Status</p>
                    <p className="font-medium">
                      {profile.isAcceptingMessage !== undefined
                        ? profile.isAcceptingMessage
                          ? "Accepting Messages"
                          : "Not Accepting Messages"
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
