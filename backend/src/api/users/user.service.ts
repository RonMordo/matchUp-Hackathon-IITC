import { UserModel } from "./user.model.js";
import { AppError } from "../../utils/appError.js";
import { CreateUserInput, PatchUserInput } from "./user.types.js";

const getAllUsers = () => {
  return UserModel.find()
    .select("-password -__v")
    .populate({ path: "ownEvents", select: "-__v" })
    .populate({ path: "participantEvents", select: "-__v" })
    .populate({ path: "messages", select: "-__v" })
    .populate({ path: "notifications", select: "-__v" })
    .populate({ path: "ratings", select: "-__v" })
    .populate({ path: "requestsSent", select: "-__v" })
    .populate({ path: "requestsReceived", select: "-__v" });
};

const getUserById = async (id: string) => {
  const user = await UserModel.findById(id)
    .select("-password -__v")
    .populate({ path: "ownEvents", select: "-__v" })
    .populate({ path: "participantEvents", select: "-__v" })
    .populate({ path: "messages", select: "-__v" })
    .populate({ path: "notifications", select: "-__v" })
    .populate({ path: "ratings", select: "-__v" })
    .populate({ path: "requestsSent", select: "-__v" })
    .populate({ path: "requestsReceived", select: "-__v" });
  if (!user) {
    throw new AppError(`User with ID: ${id} not found.`, 404);
  }
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials.", 400);
  }
  return user;
};

const createUser = async (userData: CreateUserInput) => {
  const emailExists = await UserModel.findOne({ email: userData.email });
  if (emailExists) {
    throw new AppError("Email already in use.", 409);
  }
  const savedUser = await UserModel.create(userData);
  return getUserById(savedUser._id.toString());
};

const updateUser = async (id: string, userData: CreateUserInput) => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, userData, {
    runValidators: true,
    new: true,
  })
    .select("-password -__v")
    .populate({ path: "ownEvents", select: "-__v" })
    .populate({ path: "participantEvents", select: "-__v" })
    .populate({ path: "messages", select: "-__v" })
    .populate({ path: "notifications", select: "-__v" })
    .populate({ path: "ratings", select: "-__v" })
    .populate({ path: "requestsSent", select: "-__v" })
    .populate({ path: "requestsReceived", select: "-__v" });
  if (!updatedUser) {
    throw new AppError("Invalid credentials.", 400);
  }
  return updatedUser;
};

const patchUser = async (id: string, userData: PatchUserInput) => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, userData, {
    runValidators: true,
    new: true,
  })
    .select("-password -__v")
    .populate({ path: "ownEvents", select: "-__v" })
    .populate({ path: "participantEvents", select: "-__v" })
    .populate({ path: "messages", select: "-__v" })
    .populate({ path: "notifications", select: "-__v" })
    .populate({ path: "ratings", select: "-__v" })
    .populate({ path: "requestsSent", select: "-__v" })
    .populate({ path: "requestsReceived", select: "-__v" });
  if (!updatedUser) {
    throw new AppError(`User with ID: ${id} not found.`, 404);
  }
  return updatedUser;
};

const deleteUser = async (id: string) => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new AppError(`User with ID: ${id} not found.`, 404);
  }
};

export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmail,
  updateUser,
  patchUser,
  deleteUser,
};
