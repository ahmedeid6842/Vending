const express = require('express');
const {
    addMachineController,
    getMachineController,
    getNearestMachineController,
    updateMachineContrller,
    deleteMachineContrller
} = require('../controller/machine');
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { role } = require('../middleware/role');

const router = express.Router();

router.post("/", isAuthenticated, role("admin"), addMachineController);
router.get("/", getMachineController);
router.get("/nearest/:long/:lat", getNearestMachineController);
router.put("/:machineID", isAuthenticated, role("admin"), updateMachineContrller);
router.delete("/:machineID", isAuthenticated, role("admin"), deleteMachineContrller);

module.exports.Machine = router;