import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import axios from 'axios';
import handleError from '../errorHandler/error';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useAppContext();

  const [appointments, setAppointments] = useState([]);
  const months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('/');
    return (
      dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await getUserAppointments();
        await getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-stripe`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>
        My Appointments
      </p>
      <div>
        {appointments.map(
          ({
            _id,
            cancelled,
            docData,
            slotDate,
            slotTime,
            payment,
            isCompleted,
          }) => (
            <div
              key={_id}
              className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
              <div>
                <img
                  src={docData?.image}
                  alt=''
                  className='w-36 bg-indigo-50'
                />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 text-base font-semibold'>
                  {docData.name}
                </p>
                <p>{docData.specialty}</p>
                <p className='text-zinc-700 font-medium mt-1'>address: </p>
                <p className='text-xs'>{docData.address?.line1}</p>
                <p className='text-xs'>{docData.address?.line2}</p>
                <p className=' mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>
                    Date & Time:
                  </span>
                  {slotDateFormat(slotDate)} | {slotTime}
                </p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                {!cancelled && payment && !isCompleted && (
                  <button className='sm-min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>
                    Paid
                  </button>
                )}
                {!cancelled && !payment && !isCompleted && (
                  <button
                    onClick={() => appointmentStripe(_id)}
                    className='text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer'>
                    Pay Online
                  </button>
                )}

                {!cancelled && !isCompleted && (
                  <button
                    onClick={() => cancelAppointment(_id)}
                    className='text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'>
                    Cancel Appointment
                  </button>
                )}

                {cancelled && !isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 '>
                    Appointment cancelled
                  </button>
                )}
                {isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 '>
                    Completed
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
