const { MachineModel } = require("../models/machine")

module.exports.createMachineService = async (machine) => {
    try {

        let savedMachine = await MachineModel.create(machine);

        return savedMachine;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.getMachinesService = async (queryMachine, nearest = false, populateCheck = false, numOfSkip = 0, numOfLimit = 0) => {
    /**
     * DONE: create pipeline for your aggregated query
     *  DONE: add finding by location using a point 
     *      DONE: if nearest = true then find the nearest machine, distance not exceed 5 kilos
     *      DONE: if nearest = false then find exacpoint
     *  DONE: add find based on the rest of passed query
     *  DONE: populate the productsIDs based on populate check 
     * DONE: adding pagination 
     *  DONE: skip and limit to the query with default value 0 ,, so if no value passed it'll not limit or skip
    */
    try {
        let pipeLine = [];
        if (queryMachine.location) {
            pipeLine.push({
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(queryMachine.location[0]), parseFloat(queryMachine.location[1])]
                    },

                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: nearest ? 5000 : 0
                }
            })
            delete queryMachine.location;
        }

        if (queryMachine.name) {
            pipeLine.push({
                $match: {
                    name: {
                        $regex: queryMachine.name,
                        $options: 'i'
                    }
                }
            });
            delete queryMachine.name;
        }

        if (Object.keys(queryMachine).length !== 0) {
            pipeLine.push({ $match: { ...queryMachine } })
        }

        if (populateCheck) {
            pipeLine.push({
                $lookup: {
                    from: 'products',
                    localField: 'products',
                    foreignField: '_id',
                    as: 'products'
                }
            })
        }

        let machines = await MachineModel.aggregate([...pipeLine, { $skip: numOfSkip }, { $limit: numOfLimit }]);
        if (machines.length == 0) return false;

        return machines
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.updateMachineService = async (queryMachine, updateOperation) => {
    try {
        let updateProduct = await MachineModel.findOneAndUpdate(queryMachine, updateOperation, { new: true })
        
        if (!updateProduct) return false;

        return updateProduct;
    } catch (error) {

    }
}

module.exports.deleteMachineService = async (queryMachine) => {
    try {
        let deletedMachine = await MachineModel.findOneAndDelete(queryMachine);
        return deletedMachine ? true : false;
    } catch (error) {
        throw new Error(error)
    }
}
