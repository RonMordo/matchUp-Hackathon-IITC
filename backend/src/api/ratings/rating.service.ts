import { AppError } from "../../utils/appError.js";
import { RatingModel } from "./rating.model.js";
import { CreateRatingInput, PatchRatingInput } from "./rating.types.js";

const getAllRating = () => {
  return RatingModel.find().select("-__v");
};

const getRatingById = async (id: string) => {
  const rating = await RatingModel.findById(id).select("-__v");
  if (!rating) {
    throw new AppError(`Rating with ID ${id} not found`, 404);
  }
  return rating;
};

const createRating = async (ratingData: CreateRatingInput) => {
  const rating = await RatingModel.create(ratingData);
  return getRatingById(rating._id.toString());
};

const updateRating = async (id: string, ratingData: CreateRatingInput) => {
  const updatedRating = await RatingModel.findByIdAndUpdate(id, ratingData, {
    runValidators: true,
    new: true,
  }).select("-__v");
  if (!updatedRating) {
    throw new AppError(`Rating with ID ${id} not found`, 404);
  }
  return updatedRating;
};

const patchRating = async (id: string, ratingData: PatchRatingInput) => {
  const updatedRating = await RatingModel.findByIdAndUpdate(id, ratingData, {
    runValidators: true,
    new: true,
  }).select("-__v");

  if (!updatedRating) {
    throw new AppError(`Rating with ID: ${id} not found.`, 404);
  }
  return updatedRating;
};

const deleteRating = async (id: string) => {
  const deletedRating = await RatingModel.findByIdAndDelete(id);
  if (!deletedRating) {
    throw new AppError(`Rating with ID: ${id} not found.`, 404);
  }
};

export const ratingService = {
  getAllRating,
  getRatingById,
  createRating,
  updateRating,
  patchRating,
  deleteRating,
};
