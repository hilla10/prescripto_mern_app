import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentStripe,
  verifyStripe,
} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authUser, getProfile);
router.put('/update-profile', upload.single('image'), authUser, updateProfile);
router.post('/book-appointment', authUser, bookAppointment);
router.get('/appointments', authUser, listAppointment);
router.post('/cancel-appointment', authUser, cancelAppointment);
router.post('/payment-stripe', authUser, paymentStripe);
router.post('/verifyStripe', authUser, verifyStripe);

export default router;
