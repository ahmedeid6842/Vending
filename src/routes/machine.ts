import express from 'express';
import {
    addMachineController,
    getMachineController,
    getNearestMachineController,
    updateMachineController,
    deleteMachineController
} from '../controller/machine';
import { isAuthenticated } from "../middleware/isAuthenticated";
import { role } from '../middleware/role';

const router = express.Router();

router.post("/", isAuthenticated, role("admin"), addMachineController);
router.get("/", getMachineController);
router.get("/nearest/:longitude/:latitude", getNearestMachineController);
router.put("/:machineID", isAuthenticated, role("admin"), updateMachineController);
router.delete("/:machineID", isAuthenticated, role("admin"), deleteMachineController);

export const Machine = router;