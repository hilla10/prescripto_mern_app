import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import handleError from '../errorHandler/error';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { backendUrl, token, setToken } = useAppContext();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [token]);

  return (
    <form onSubmit={handleSubmit} className='min-h-[8vh] flex items-center '>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p>
          Please {state === 'Sign Up' ? 'sign up' : 'Login'} to book appointment
        </p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <label>Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type='text'
              required
            />
          </div>
        )}
        <div className='w-full'>
          <label>Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='email'
            required
          />
        </div>
        <div className='w-full'>
          <label>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='password'
            required
          />
        </div>
        <button
          type='submit'
          className='bg-primary text-white w-full py-2 my-2 rounded-md text-base cursor-pointer'>
          {' '}
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>
        <p>
          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className='text-primary underline cursor-pointer'>
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an new account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className='text-primary underline cursor-pointer'>
                Click here
              </span>
            </p>
          )}
        </p>
      </div>
    </form>
  );
};

export default Login;
