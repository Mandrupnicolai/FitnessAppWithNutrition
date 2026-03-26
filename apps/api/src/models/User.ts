import mongoose, { Schema } from "mongoose";

export type UserDoc = {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDoc>("User", userSchema);

