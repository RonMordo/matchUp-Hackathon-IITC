import { userService } from "./user.service.js";
import { CreateUserInput, PatchUserInput, ResponseUser } from "./user.types.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, IdParams } from "../../utils/globalTypes.js";

const getAllUsers = async (
  _req: Request,
  res: Response<ResponseUser[]>,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (
  req: Request<IdParams>,
  res: Response<ResponseUser>,
  next: NextFunction
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (
  req: AuthenticatedRequest<{}, {}, CreateUserInput>,
  res: Response<ResponseUser>,
  next: NextFunction
) => {
  try {
    const updatedUser = await userService.updateUser(req.user!.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (err) {
    return next(err);
  }
};

const patchUser = async (
  req: AuthenticatedRequest<{}, {}, PatchUserInput>,
  res: Response<ResponseUser>,
  next: NextFunction
) => {
  try {
    const updatedUser = await userService.patchUser(req.user!.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (err) {
    return next(err);
  }
};

const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.deleteUser(req.user!.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
};
