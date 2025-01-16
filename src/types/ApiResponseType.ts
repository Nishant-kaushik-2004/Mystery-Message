import { Message, User } from "@/models/user.model";

export default interface ApiResponseType {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Message[];
  userProfile?: User;
}
