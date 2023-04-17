const express = require('express');
const {
    addMachineController,
    getMachineController,
    getNearestMachineController,
    updateMachineController,
    deleteMachineController
} = require('../controller/machine');
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { role } = require('../middleware/role');

const router = express.Router();

router.post("/", isAuthenticated, role("admin"), addMachineController);
router.get("/", getMachineController);
router.get("/nearest/:longitude/:latitude", getNearestMachineController);
router.put("/:machineID", isAuthenticated, role("admin"), updateMachineController);
router.delete("/:machineID", isAuthenticated, role("admin"), deleteMachineController);

module.exports.Machine = router;