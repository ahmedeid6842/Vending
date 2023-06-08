const { addMachineValidation, getMachineQueryValidation, getNearestParameterValidation, getNearestMachineValidation } = require("../validators/machine")
const { createMachineService, getMachinesService, deleteMachineService, updateMachineService } = require("../services/machine")
module.exports.addMachineController = async (req, res) => {
    /**
     * DONE: user must be authenticated
     * DONE: check the user role, only admin can add machine
     * DONE: validate request body
     * TODO: you can't add two machines with distance between them less than 2 kilometer
     * DONE: add the machine with it's long,lat
     */

    const { error } = addMachineValidation(req.body);
    if (error) return res.status(400).send(error.details);

    let savedMachine = await createMachineService(req.body);
    return res.status(201).send({ message: "machine added succesfully", machine: savedMachine })
}

module.exports.getMachineController = async (req, res) => {
    /**
     * DONE: validate incoming request query
     * DONE: if there is a request query passed then find a machin based on query - else return all machines
     *  DONE: at this endpoint if location property was set is find exact match not the nearest one.
     */
    const { error } = getMachineQueryValidation(req.query);
    if (error) return res.status(400).send(error.details)

    const machinesPerPage = 10, pageNumber = req.query.page || 1;
    delete req.query.page;

    const machines = await getMachinesService(req.query, true, false, true, (machinesPerPage * pageNumber) - machinesPerPage, machinesPerPage);
    if (!machines) return res.status(404).send({ message: "No machine found" });

    return res.status(200).send(machines);
}

module.exports.getNearestMachineController = async (req, res) => {
    /**
     * DONE: validate incoming request parameter
     * DONE: find the nearest five machines near to that location
     */
    const { error } = getNearestMachineValidation(req.params);
    if (error) return res.status(400).send(error.details);

    const machines = await getMachinesService({ location: [req.params.longitude, req.params.latitude] }, true, true, true, 0, 5);
    if (!machines) return res.status(404).send({ message: "No machine found" });

    return res.status(200).send(machines);
}

module.exports.updateMachineController = async (req, res) => {
    /**
     * DONE: user must be authenticated 
     * DONE: check the user role , only admin is able to update
     * DONE: validate request body to ensure it matches update machine criteria
     * DONE: check if the machine exist
     * DONE: update product with given ID
     */
    const { error } = addMachineValidation(req.body, true);
    if (error) return res.status(400).send(error.details);

    let updatedMachine = await updateMachineService({ _id: req.params.machineID }, { $set: req.body });
    if (!updatedMachine) return res.status(400).send({ message: "No machine found" });

    return res.status(201).send({ message: "update succesfully", updatedMachine });
}

module.exports.deleteMachineController = async (req, res) => {
    /**
     * DONE: user must be authenticated 
     * DONE: check the user role , only admin is able to delete
     * DONE: check if the machine Id exsist or not 
     * DONE: delete the machine with given ID
     */
    let deletedMachine = await deleteMachineService({ _id: req.params.machineID });
    if (!deletedMachine) return res.status(404).send({ path: "machine ID", message: "no machine found" })

    return res.send({ message: "deleted succesfully" });
}
