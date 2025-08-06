import { requestService } from "./request.service.js";
import {
  CreateRequestInput,
  PatchRequestInput,
  IRequest,
} from "./request.types.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, IdParams } from "../../utils/globalTypes.js";

const getAllRequests = async (
  _req: Request,
  res: Response<IRequest[]>,
  next: NextFunction
) => {
  try {
    const requests = await requestService.getAllRequests();
    return res.status(200).json(requests);
  } catch (err) {
    return next(err);
  }
};

const getRequestById = async (
  req: Request<IdParams>,
  res: Response<IRequest>,
  next: NextFunction
) => {
  try {
    const request = await requestService.getRequestById(req.params.id);
    return res.status(200).json(request);
  } catch (err) {
    return next(err);
  }
};

const updateRequest = async (
  req: AuthenticatedRequest<IdParams, {}, CreateRequestInput>,
  res: Response<IRequest>,
  next: NextFunction
) => {
  try {
    const updatedRequest = await requestService.updateRequest(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedRequest);
  } catch (err) {
    return next(err);
  }
};

const patchRequest = async (
  req: AuthenticatedRequest<IdParams, {}, PatchRequestInput>,
  res: Response<IRequest>,
  next: NextFunction
) => {
  try {
    const updatedRequest = await requestService.patchRequest(
      req.params.id,
      req.body
    );
    return res.status(200).json(updatedRequest);
  } catch (err) {
    return next(err);
  }
};

const deleteRequest = async (
  req: AuthenticatedRequest<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    await requestService.deleteRequest(req.params.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const requestController = {
  getAllRequests,
  getRequestById,
  updateRequest,
  patchRequest,
  deleteRequest,
};
