import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


export const registerUser = async (data: any)=> {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword
  });

  return user;

};


export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");
  
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user
  };
  };
