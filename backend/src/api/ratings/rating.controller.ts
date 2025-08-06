import { ratingService } from "./rating.service.js";
import {
  CreateRatingInput,
  PatchRatingInput,
  IRating,
} from "./rating.types.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, IdParams } from "../../utils/globalTypes.js";

const getAllRating = async (
  _req: Request,
  res: Response<IRating[]>,
  next: NextFunction
) => {
  try {
    const rating = await ratingService.getAllRating();
    return res.status(200).json(rating);
  } catch (err) {
    return next(err);
  }
};

const getRatingById = async (
  req: Request<IdParams>,
  res: Response<IRating>,
  next: NextFunction
) => {
  try {
    const rating = await ratingService.getRatingById(req.params.id);
    return res.status(200).json(rating);
  } catch (err) {
    return next(err);
  }
};

const createRating = async (
  req: AuthenticatedRequest<{}, {}, CreateRatingInput>,
  res: Response<IRating>,
  next: NextFunction
) => {
  try {
    const newRating = await ratingService.createRating(req.body);
    const savedRating = await ratingService.getRatingById(
      newRating._id.toString()
    );
    return res.status(201).json(savedRating);
  } catch (err) {
    return next(err);
  }
};

const updateRating = async (
  req: AuthenticatedRequest<IdParams, {}, CreateRatingInput>,
  res: Response<IRating>,
  next: NextFunction
) => {
  try {
    const updatedRating = await ratingService.updateRating(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedRating);
  } catch (err) {
    return next(err);
  }
};

const patchRating = async (
  req: AuthenticatedRequest<IdParams, {}, PatchRatingInput>,
  res: Response<IRating>,
  next: NextFunction
) => {
  try {
    const updatedRating = await ratingService.patchRating(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedRating);
  } catch (err) {
    return next(err);
  }
};

const deleteRating = async (
  req: AuthenticatedRequest<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    await ratingService.deleteRating(req.params.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const ratingController = {
  getAllRating,
  getRatingById,
  createRating,
  updateRating,
  patchRating,
  deleteRating,
};
