import { AppError } from "../../utils/appError.js";
import { RequestModel } from "./request.model.js";
import { CreateRequestInput, PatchRequestInput } from "./request.types.js";

const getAllRequests = () => {
  return RequestModel.find().select("-__v");
};

const getRequestById = async (id: string) => {
  const request = await RequestModel.findById(id).select("-__v");
  if (!request) {
    throw new AppError(`Request with ID ${id} not found`, 404);
  }
  return request;
};

const createRequest = async (requestData: CreateRequestInput) => {
  const request = await RequestModel.create(requestData);
  return getRequestById(request._id.toString());
};

const updateRequest = async (id: string, requestData: CreateRequestInput) => {
  const updatedRequest = await RequestModel.findByIdAndUpdate(id, requestData, {
    runValidators: true,
    new: true,
  }).select("-__v");
  if (!updatedRequest) {
    throw new AppError(`Request with ID ${id} not found`, 404);
  }
  return updatedRequest;
};

const patchRequest = async (id: string, requestData: PatchRequestInput) => {
  const updatedRequest = await RequestModel.findByIdAndUpdate(id, requestData, {
    runValidators: true,
    new: true,
  }).select("-__v");

  if (!updatedRequest) {
    throw new AppError(`Request with ID: ${id} not found.`, 404);
  }
  return updatedRequest;
};

const deleteRequest = async (id: string) => {
  const deletedRequest = await RequestModel.findByIdAndDelete(id);
  if (!deletedRequest) {
    throw new AppError(`Request with ID: ${id} not found.`, 404);
  }
};

export const requestService = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  patchRequest,
  deleteRequest,
};
