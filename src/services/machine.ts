import mongoose from 'mongoose';
import { MachineModel } from '../models/machine';
import { PipelineStage } from 'mongoose';

export const createMachineService = async (machine: any) => {
  try {
    const savedMachine = await MachineModel.create(machine);

    return savedMachine;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMachinesService = async (
  queryMachine: any,
  _isCache = false,
  nearest = false,
  populateCheck = false,
  numOfSkip = 0,
  numOfLimit = 0
) => {
  /**
   * DONE: create pipeline for your aggregated query
   *  DONE: add finding by location using a point
   *      DONE: if nearest = true then find the nearest machine, distance not exceed 5 kilos
   *      DONE: if nearest = false then find exacpoint
   *  DONE: add find based on the rest of passed query
   *      DONE: if the name property exist, then make search using reg expression
   *      DONE: if the _id property is exist then cast the _id to mongoose ObjectId
   *  DONE: populate the productsIDs based on populate check
   *  DONE: adding pagination
   *      DONE: skip and limit to the query with default value 0 ,, so if no value passed it'll not limit or skip
   */
  try {
    const pipeLine: PipelineStage[] = [];
    if (queryMachine.location) {
      pipeLine.push({
        $geoNear: {
          near: {
            type: 'Point' as const,
            coordinates: [
              parseFloat(queryMachine.location[0]),
              parseFloat(queryMachine.location[1]),
            ],
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: nearest ? 5000 : 0,
        },
      });
      delete queryMachine.location;
    }

    if (queryMachine.name) {
      pipeLine.push({
        $match: {
          name: {
            $regex: queryMachine.name,
            $options: 'i',
          },
        },
      });
      delete queryMachine.name;
    }
    if (queryMachine._id) {
      pipeLine.push({
        $match: { _id: new mongoose.Types.ObjectId(queryMachine._id) },
      });
      delete queryMachine._id;
    }

    if (Object.keys(queryMachine).length !== 0) {
      pipeLine.push({ $match: { ...queryMachine } });
    }

    if (populateCheck) {
      pipeLine.push({
        $lookup: {
          from: 'products',
          localField: 'products',
          foreignField: '_id',
          as: 'products',
        },
      });
    }

    pipeLine.push({ $skip: numOfSkip });

    if (numOfLimit > 0) {
      pipeLine.push({ $limit: numOfLimit });
    }

    const machines = await MachineModel.aggregate([...pipeLine]);
    if (machines.length == 0) return false;

    return machines;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateMachineService = async (
  queryMachine: any,
  updateOperation: any
) => {
  try {
    const updateProduct = await MachineModel.findOneAndUpdate(
      queryMachine,
      updateOperation,
      { new: true }
    );

    if (!updateProduct) return false;

    return updateProduct;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteMachineService = async (queryMachine: any) => {
  try {
    const deletedMachine = await MachineModel.findOneAndDelete(queryMachine);
    return deletedMachine ? true : false;
  } catch (error: any) {
    throw new Error(error);
  }
};
