import React from 'react';
import { useAdminContext } from '../../context/AdminContext';
import { useEffect } from 'react';
import { assets } from '../../assets/assets_admin/assets';
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { getDashboardData, dashboardData, adminToken, cancelAppointment } =
    useAdminContext();

  const { slotDateFormat } = useAppContext();

  useEffect(() => {
    if (adminToken) {
      getDashboardData();
    }
  }, [adminToken]);

  return (
    dashboardData && (
      <div className='m-5 '>
        <div className='flex flex-wrap gap-3'>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.doctor_icon} alt='' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>
                {dashboardData.doctors}
              </p>
              <p className='text-gray-400 text-sm'>Doctors</p>
            </div>
          </div>

          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.appointments_icon} alt='' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>
                {dashboardData.appointment}
              </p>
              <p className='text-gray-400 text-sm'>Appointments</p>
            </div>
          </div>

          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.patients_icon} alt='' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>
                {dashboardData.patients}
              </p>
              <p className='text-gray-400 text-sm'>Patients</p>
            </div>
          </div>
        </div>

        <div className='bg-white  '>
          <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-300 '>
            <img src={assets.list_icon} alt='' />
            <p className='font-semibold text-gray-700'>Latest Bookings</p>
          </div>

          <div className='pt-4 border border-t-0 border-gray-300  '>
            {dashboardData.latestAppointments.map(
              ({
                _id,
                docData,
                slotDate,
                cancelled,
                slotTime,
                isCompleted,
              }) => (
                <div
                  className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100 '
                  key={_id}>
                  <img
                    className='rounded-full w-10'
                    src={docData.image}
                    alt=''
                  />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium'>{docData.name}</p>
                    <p className='text-gray-600'>
                      {slotDateFormat(slotDate)} - {slotTime}
                    </p>
                  </div>

                  {cancelled ? (
                    <p className='text-red-400 text-xs font-medium '>
                      Cancelled
                    </p>
                  ) : isCompleted ? (
                    <p className='text-green-500 text-xs font-medium '>
                      Completed
                    </p>
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
      </div>
    )
  );
};

export default Dashboard;
