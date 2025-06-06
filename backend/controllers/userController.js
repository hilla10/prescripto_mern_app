import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';
import Stripe from 'stripe';
// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //   validating empty fields
    if (!name || !password || !email) {
      return res
        .status(400)
        .json({ success: false, message: 'Please fill all fields' });
    }

    //   validation email format

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Please enter a valid email' });
    }

    // validating strong password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: 'Please enter strong password' });
    }

    //   hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new User(userData);

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findById(userId).select('-password');

    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res
        .status(400)
        .json({ success: false, message: 'Please file all the fields' });
    }

    await User.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    console.log(imageFile);

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });
      const imageURL = imageUpload.secure_url;
      console.log(imageURL);
      await User.findByIdAndUpdate(userId, { image: imageURL });
    }

    return res
      .status(201)
      .json({ success: true, message: 'profile updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to book appointment

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await Doctor.findById(docId).select('-password');

    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, message: 'Doctor not available' });
    }

    let slots_booked = docData.slots_booked;

    // checking for slots availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res
          .status(400)
          .json({ success: false, message: 'Slot not available' });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await User.findById(userId).select('-password');

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fee,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new Appointment(appointmentData);

    await newAppointment.save();

    // save new slots data in doctors data;
    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    res.status(201).json({ success: true, message: 'appointment booked' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user appointment for frontend my-appointment page

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await Appointment.find({ userId });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to cancel appointment

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized action' });
    }

    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

    // releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await Doctor.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    res.status(201).json({ success: true, message: 'Appointment canceled' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = 'usd';

// API to make appointment using stripe
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { origin } = req.headers;

    const appointmentData = await Appointment.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.status(404).json({
        success: false,
        message: 'Appointment cancelled or not found',
      });
    }

    // creating options for stripe payment

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: 'Appointment Payment',
          },
          unit_amount: Math.round(appointmentData.amount * 100), // Stripe expects amount in cents
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
      line_items,
      mode: 'payment',
    });

    res
      .status(200)
      .json({ success: true, line_items, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to verify payment of stripe

const verifyStripe = async (req, res) => {
  const { appointmentId, success, userId } = req.body;

  if (!appointmentId || typeof success === 'undefined') {
    return res
      .status(400)
      .json({ success: false, message: 'Missing parameters' });
  }
  try {
    const isSuccess = success === 'true' || success === true;
    if (isSuccess) {
      await Appointment.findByIdAndUpdate(appointmentId, { payment: true });
      // await User.findByIdAndUpdate(userId, { cartData: {} });
      return res
        .status(200)
        .json({ success: true, message: 'Payment verified' });
    } else {
      await Appointment.findByIdAndDelete(appointmentId);
      return res
        .status(200)
        .json({ success: false, message: 'Payment failed or canceled' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentStripe,
  verifyStripe,
};
