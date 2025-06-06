import React, { useState } from 'react';

import { useAdminContext } from '../context/AdminContext';
import axios from 'axios';
import handleError from '../errorHandler/error';
import { toast } from 'react-toastify';
import { useDoctorContext } from '../context/DoctorContext';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAdminToken, backendUrl } = useAdminContext();
  const { setDToken } = useDoctorContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem('adminToken', data.token);
          setAdminToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          console.log(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-primary'>{state} </span>
          Login
        </p>
        <div className='w-full '>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='email'
            required
          />
        </div>

        <div className='w-full '>
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='password'
            required
          />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer'>
          Login
        </button>

        {state === 'Admin' ? (
          <p>
            Doctor Login?{' '}
            <span
              className='text-primary underline cursor-pointer'
              onClick={() => setState('Doctor')}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{' '}
            <span
              className='text-primary underline cursor-pointer'
              onClick={() => setState('Admin')}>
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
