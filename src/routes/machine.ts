import express from 'express';
import {
  addMachineController,
  getMachineController,
  getNearestMachineController,
  updateMachineController,
  deleteMachineController,
} from '../controller/machine';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { role } from '../middleware/role';
import { validate } from '../middleware/validate';
import { MachineValidators } from '../validators/machine';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  role('admin'),
  validate(MachineValidators.addMachineBody, 'body'),
  addMachineController
);
router.get(
  '/',
  getMachineController,
  validate(MachineValidators.getMachineQuery, 'query')
);
router.get(
  '/nearest/:longitude/:latitude',
  validate(MachineValidators.getNearestMachineParams, 'params'),
  getNearestMachineController
);
router.put(
  '/:machineID',
  isAuthenticated,
  role('admin'),
  validate(MachineValidators.updateMachineBody, 'body'),
  updateMachineController
);
router.delete(
  '/:machineID',
  isAuthenticated,
  role('admin'),
  deleteMachineController
);

export const Machine = router;
