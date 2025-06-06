import React from 'react';
import { specialtyData } from '../assets/assets_frontend/assets';
import { Link } from 'react-router-dom';

const SpecialtyMenu = () => {
  return (
    <section
      id='specialty'
      className='flex flex-col items-center gap-4 py-16 text-[#262626]'>
      <h1 className='text-3xl font-medium'>Find by Specialty</h1>
      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>

      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll '>
        {specialtyData.map(({ specialty, image }, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'
            key={index}
            to={`doctors/${specialty}`}>
            <img src={image} alt='' className='w-16 sm:w-24 mb-2 ' />
            <p>{specialty}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialtyMenu;
