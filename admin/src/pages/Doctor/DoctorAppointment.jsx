import React from 'react';
import { useDoctorContext } from '../../context/DoctorContext';
import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_admin/assets';

const DoctorAppointment = () => {
  const {
    appointments,
    dToken,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useDoctorContext();
  const { calculateAge, slotDateFormat, currency } = useAppContext();

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border border-gray-300 rounded text-sm max-h-[80vh]  min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b border-gray-300 '>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {appointments
          .reverse()
          .map(
            (
              {
                _id,
                userData,
                payment,
                slotDate,
                slotTime,
                amount,
                cancelled,
                isCompleted,
              },
              index
            ) => (
              <div
                className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-50'
                key={_id}>
                <p className='max-sm:hidden '>{index + 1}</p>
                <div className='flex items-center gap-2 '>
                  <img
                    className='w-8 rounded-full'
                    src={userData.image}
                    alt=''
                  />
                  <p>{userData.name} </p>
                </div>
                <div>
                  <p className='uppercase text-xs inline border border-primary px-2 rounded-full'>
                    {payment ? 'Online' : 'Cash'}
                  </p>
                </div>

                <p className='max-sm:hidden '>{calculateAge(userData.dob)}</p>
                <p>
                  {slotDateFormat(slotDate)}, {slotTime}
                </p>
                <p>
                  {currency}
                  {amount}
                </p>

                {cancelled ? (
                  <p className='text-red-500 text-xs font-medium '>Cancelled</p>
                ) : isCompleted ? (
                  <p className='text-green-500 text-xs font-medium '>
                    Completed
                  </p>
                ) : (
                  <div className='flex  '>
                    <img
                      onClick={() => cancelAppointment(_id)}
                      className='w-10 cursor-pointer'
                      src={assets.cancel_icon}
                      alt=''
                    />
                    <img
                      onClick={() => completeAppointment(_id)}
                      className='w-10 cursor-pointer'
                      src={assets.tick_icon}
                      alt=''
                    />
                  </div>
                )}
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
