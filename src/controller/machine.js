module.exports.addMachineController = async (req, res) => {
    /**
     * DONE: user must be authenticated
     * DONE: check the user role, only admin can add machine
     * TODO: validate request body
     * TODO: you can't add two machines distance between them 2 kilometer
     * TODO: add the machine with it's long,lat
     */
}

module.exports.getMachineController = async (req, res) => {
    /**
     * TODO: validate incoming request query
     * TODO: if there is a request query passed then find a machin based on query - else return all machines
     * TODO: adding pagination
     * TODO: populate the productsIDs to get all product data at that machine
     */
}

module.exports.getNearestMachineController = async (req, res) => {
    /**
     * TODO: validate incoming request parameter
     * TODO: find the nearest five machines near to that location
     * TODO: populate the productIDS to get all product data at that machine
     */
}

module.exports.updateMachineContrller = async (req, res) => {
    /**
     * TODO: user must be authenticated 
     * TODO: check the user role , only admin is able to update
     * TODO: validate request body to ensure it matches update machine criteria
     * TODO: check if the machine exist
     * TODO: update product with given ID
     */
}

module.exports.deleteMachineContrller = async (req, res) => {
    /**
     * TODO: user must be authenticated 
     * TODO: check the user role , only admin is able to delete
     * TODO: check if the machine Id exsist or not 
     * TODO: delete the machine with given ID
     */
}