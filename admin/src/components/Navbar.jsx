import React from 'react';
import { assets } from '../assets/assets_admin/assets';
import { useAdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { useDoctorContext } from '../context/DoctorContext';
const Navbar = () => {
  const { adminToken, setAdminToken } = useAdminContext();
  const { dToken, setDToken } = useDoctorContext();
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    adminToken && setAdminToken('');
    adminToken && localStorage.removeItem('adminToken');
    dToken && setDToken('');
    dToken && localStorage.removeItem('dToken');
  };

  return (
    <nav className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img
          className='w-36 sm:w-40 cursor-pointer'
          src={assets.admin_logo}
          alt=''
        />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {adminToken ? 'Admin' : 'Doctor'}
        </p>
      </div>
      <button
        onClick={logout}
        className='bg-primary text-white text-sm px-10 py-2 rounded-full cursor-pointer'>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
