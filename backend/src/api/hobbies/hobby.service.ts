import { AppError } from "../../utils/appError.js";
import { HobbyModel } from "./hobby.model.js";
import { CreateHobbyInput, PatchHobbyInput } from "./hobby.types.js";

const getAllHobbys = () => {
  return HobbyModel.find().select("-__v");
};

const getHobbyById = async (id: string) => {
  const hobby = await HobbyModel.findById(id).select("-__v");
  if (!hobby) {
    throw new AppError(`Hobby with ID ${id} not found`, 404);
  }
  return hobby;
};

const createHobby = async (hobbyData: CreateHobbyInput) => {
  const hobby = await HobbyModel.create(hobbyData);
  return getHobbyById(hobby._id.toString());
};

const updateHobby = async (id: string, hobbyData: CreateHobbyInput) => {
  const updatedHobby = await HobbyModel.findByIdAndUpdate(id, hobbyData, {
    runValidators: true,
    new: true,
  }).select("-__v");
  if (!updatedHobby) {
    throw new AppError(`Hobby with ID ${id} not found`, 404);
  }
  return updatedHobby;
};

const patchHobby = async (id: string, hobbyData: PatchHobbyInput) => {
  const updatedHobby = await HobbyModel.findByIdAndUpdate(id, hobbyData, {
    runValidators: true,
    new: true,
  }).select("-__v");

  if (!updatedHobby) {
    throw new AppError(`Hobby with ID: ${id} not found.`, 404);
  }
  return updatedHobby;
};

const deleteHobby = async (id: string) => {
  const deletedHobby = await HobbyModel.findByIdAndDelete(id);
  if (!deletedHobby) {
    throw new AppError(`Hobby with ID: ${id} not found.`, 404);
  }
};

const createHobbies = async (hobbies: CreateHobbyInput[]) => {
  return await Promise.all(hobbies.map((hobby) => createHobby(hobby)));
};

export const hobbyService = {
  getAllHobbys,
  getHobbyById,
  createHobby,
  createHobbies,
  updateHobby,
  patchHobby,
  deleteHobby,
};
