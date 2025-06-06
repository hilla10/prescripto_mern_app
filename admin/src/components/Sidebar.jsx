import React from 'react';
import { useAdminContext } from '../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets_admin/assets';
import { useDoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
  const { adminToken } = useAdminContext();
  const { dToken } = useDoctorContext();

  return (
    <aside className='min-h-screen bg-white border-r border-r-gray-300'>
      {adminToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
            to='/admin-dashboard'>
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
            to='/all-appointments'>
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
            to='/add-doctor'>
            <img className='min-w-5' src={assets.add_icon} alt='' />
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
            to='/doctor-list'>
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Doctors List</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
            to='/doctor-dashboard'>
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
            to='/doctor-appointments'>
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
            to='/doctor-profile'>
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
