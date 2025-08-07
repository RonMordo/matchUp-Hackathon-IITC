import { hobbyService } from "./hobby.service.js";
import { CreateHobbyInput, PatchHobbyInput, IHobby } from "./hobby.types.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, IdParams } from "../../utils/globalTypes.js";

const getAllHobbys = async (
  _req: Request,
  res: Response<IHobby[]>,
  next: NextFunction
) => {
  try {
    const hobbies = await hobbyService.getAllHobbys();
    return res.status(200).json(hobbies);
  } catch (err) {
    return next(err);
  }
};

const getHobbyById = async (
  req: Request<IdParams>,
  res: Response<IHobby>,
  next: NextFunction
) => {
  try {
    const hobby = await hobbyService.getHobbyById(req.params.id);
    return res.status(200).json(hobby);
  } catch (err) {
    return next(err);
  }
};

const createHobby = async (
  req: AuthenticatedRequest<{}, {}, CreateHobbyInput>,
  res: Response<IHobby>,
  next: NextFunction
) => {
  try {
    const newHobby = await hobbyService.createHobby(req.body);
    const savedHobby = await hobbyService.getHobbyById(newHobby._id.toString());
    return res.status(201).json(savedHobby);
  } catch (err) {
    return next(err);
  }
};

const updateHobby = async (
  req: AuthenticatedRequest<IdParams, {}, CreateHobbyInput>,
  res: Response<IHobby>,
  next: NextFunction
) => {
  try {
    const updatedHobby = await hobbyService.updateHobby(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedHobby);
  } catch (err) {
    return next(err);
  }
};

const patchHobby = async (
  req: AuthenticatedRequest<IdParams, {}, PatchHobbyInput>,
  res: Response<IHobby>,
  next: NextFunction
) => {
  try {
    const updatedHobby = await hobbyService.patchHobby(req.params.id, req.body);
    return res.status(200).json(updatedHobby);
  } catch (err) {
    return next(err);
  }
};

const deleteHobby = async (
  req: AuthenticatedRequest<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    await hobbyService.deleteHobby(req.params.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const hobbyController = {
  getAllHobbys,
  getHobbyById,
  createHobby,
  updateHobby,
  patchHobby,
  deleteHobby,
};
