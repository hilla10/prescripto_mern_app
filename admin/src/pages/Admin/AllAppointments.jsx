import React from 'react';
import { useAdminContext } from '../../context/AdminContext';
import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_admin/assets';

const AllAppointments = () => {
  const { adminToken, appointments, getAllAppointments, cancelAppointment } =
    useAdminContext();
  const { calculateAge, slotDateFormat, currency } = useAppContext();

  useEffect(() => {
    if (adminToken) {
      getAllAppointments();
    }
  }, [adminToken]);

  return (
    <div className='w-full max-w-6xl m-5 '>
      <p className='mb-3 text-lg font-medium '>All Appointments</p>
      <div className='bg-white border border-gray-300 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll '>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-300 '>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {appointments.map(
          (
            {
              _id,
              docData,
              userData,
              slotDate,
              slotTime,
              amount,
              cancelled,
              isCompleted,
            },
            index
          ) => (
            <div
              className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-50 '
              key={_id}>
              <p className='max-sm:hidden  '>{index + 1}</p>
              <div className='flex items-center gap-2 '>
                <img className='w-8 rounded-full' src={userData.image} alt='' />
                <p>{userData.name}</p>
              </div>
              <p className='max-sm-hidden '>{calculateAge(userData.dob)}</p>
              <p>
                {slotDateFormat(slotDate)}, {slotTime}
              </p>

              <div className='flex items-center gap-2 '>
                <img
                  className='w-8 rounded-full bg-gray-200 '
                  src={docData.image}
                  alt=''
                />
                <p>{docData.name}</p>
              </div>
              <p>
                {currency}
                {amount}
              </p>
              {cancelled ? (
                <p className='text-red-400 text-xs font-medium '>Cancelled</p>
              ) : isCompleted ? (
                <p className='text-green-500 text-xs font-medium '>Completed</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(_id)}
                  className='w-10 cursor-pointer '
                  src={assets.cancel_icon}
                  alt=''
                />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
