import mongoose, { Document, Schema, Model } from "mongoose";

// 1. Create and export an interface representing a document in MongoDB.
export interface Message extends Document {
  content: string;
  createdAt: Date;
}
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  imageUrl: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "plaese use a valid email adress.",
    ], //This is regEx used for basic email format validation.
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  imageUrl: {
    type: String,
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCode expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: {
    type: [MessageSchema],
  },
});

const UserModel =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
