"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/user.model";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import ApiResponseType from "@/types/ApiResponseType";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirmation = async () => {
    const response = await axios.delete<ApiResponseType>(
      `api/delete-message?msgId=${message._id}`
    );
    toast({
      title: response.data.message,
    });
    onMessageDelete(message._id as string);
  };

  const createdAt = new Date(message.createdAt);
  const indianStandardTime = createdAt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  return (
    <Card className="relative">
      <CardHeader>
        {/* <CardTitle >You've got a new message</CardTitle> */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-8  h-8 absolute right-4 top-3"
            >
              <X className="!w-5 !h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:w-auto w-96 rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. It will permanently delete this
                message and remove it from your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirmation}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardDescription>You&apos;ve got a new message</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">{message.content}</p>
      </CardContent>
      <CardFooter>
        <p>{indianStandardTime}</p>
      </CardFooter>
    </Card>
  );
}
