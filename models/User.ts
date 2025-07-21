import { Schema, model, models, Model } from "mongoose";
import IUser from "@/interfaces/IUser";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;