import React, { useEffect } from 'react';
import { useAdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, getAllDoctors, adminToken, changeAvailability } =
    useAdminContext();

  useEffect(() => {
    if (adminToken) {
      getAllDoctors();
    }
  }, [adminToken]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map(({ _id, image, name, specialty, available }) => (
          <div
            className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group'
            key={_id}>
            <img
              className='bg-indigo-50 group-hover:bg-primary transition-all duration-500 '
              src={image}
              alt=''
            />
            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium '>{name}</p>
              <p className='text-zinc-600 text-sm '>{specialty}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input
                  onChange={() => changeAvailability(_id)}
                  type='checkbox'
                  checked={available}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
