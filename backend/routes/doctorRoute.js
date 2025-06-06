import { Router } from 'express';
import {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  updateDoctorProfile,
  doctorProfile,
} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const router = Router();

router.get('/list', doctorList);
router.post('/login', loginDoctor);
router.get('/appointments', authDoctor, appointmentsDoctor);
router.post('/complete-appointment', authDoctor, appointmentComplete);
router.post('/cancel-appointment', authDoctor, appointmentCancel);
router.get('/dashboard', authDoctor, doctorDashboard);
router.get('/profile', authDoctor, doctorProfile);
router.put('/update-profile', authDoctor, updateDoctorProfile);

export default router;
