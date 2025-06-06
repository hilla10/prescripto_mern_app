import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const TopDoctors = () => {
  const navigate = useNavigate();

  const { doctors } = useAppContext();

  return (
    <section className='flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors
          .slice(0, 10)
          .map(({ _id, name, image, specialty, available }) => (
            <div
              onClick={() => {
                navigate(`/appointment/${_id}`);
                scrollTo(0, 0);
              }}
              key={_id}
              className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
              <img className='bg-[#EAEFFF]' src={image} alt='' />
              <div className='p-4'>
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    available ? 'text-green-500' : 'text-red-500'
                  } `}>
                  <p
                    className={`w-2 h-2 rounded-full ${
                      available ? 'bg-green-500' : 'bg-red-500'
                    }`}></p>
                  <p>{available ? 'Available' : 'Not Available'}</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{name}</p>
                <p className='text-gray-600 text-sm'>{specialty}</p>
              </div>
            </div>
          ))}
      </div>
      <button
        onClick={() => {
          navigate('/doctors');
          scrollTo(0, 0);
        }}
        className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'>
        More
      </button>
    </section>
  );
};

export default TopDoctors;
