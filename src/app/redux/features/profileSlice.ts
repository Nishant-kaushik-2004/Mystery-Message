import { User } from "@/models/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Profile = {
  _id: string;
  username: string;
  email: string;
  isAcceptingMessage: boolean;
  imageUrl: string;
};
const initialState: Profile = {
  _id: "",
  username: "",
  email: "",
  isAcceptingMessage: true,
  imageUrl: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state: Profile, action: PayloadAction<User>) => {
      state._id = action.payload._id as string;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isAcceptingMessage = action.payload.isAcceptingMessage;
      state.imageUrl = action.payload.imageUrl;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
