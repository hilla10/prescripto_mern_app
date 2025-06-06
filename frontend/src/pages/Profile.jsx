import React, { useState } from 'react';

import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import handleError from '../errorHandler/error';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);

  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useAppContext();
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      image && formData.append('image', image);

      const { data } = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    userData && (
      <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>
        {isEdit ? (
          <label htmlFor='image'>
            <div className='inline-block relative cursor-pointer'>
              <img
                className='w-36 rounded-full opacity-75'
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=''
              />
              <img
                className='w-10 absolute bottom-12 right-12 rounded-full '
                src={image ? '' : assets.upload_icon}
                alt=''
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type='file'
              id='image'
              hidden
            />
          </label>
        ) : (
          <img className='w-36 rounded-full' src={userData.image} alt='' />
        )}

        {isEdit ? (
          <input
            className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
            type='text'
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className='font-medium text-3xl text-[#262626] mt-4'>
            {userData.name}
          </p>
        )}

        <hr className='bg-zinc-400 h-[1px] border-none' />
        <div>
          <p className='uppercase text-neutral-500 underline mt-3'>
            Contact Information
          </p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Email id:</p>
            <p className='text-blue-500'>{userData.email}</p>
            <p className='font-medium'>Phone: </p>
            {isEdit ? (
              <input
                className='bg-gray-100 max-w-52'
                type='text'
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className='text-blue-500'>{userData.phone}</p>
            )}
            <p className='font-medium'>Address: </p>
            {isEdit ? (
              <p className='text-gray-500'>
                <input
                  className='bg-gray-50'
                  type='text'
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value,
                      },
                    }))
                  }
                />
                <br />
                <input
                  className='bg-gray-50'
                  type='text'
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value,
                      },
                    }))
                  }
                />
              </p>
            ) : (
              <p>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className='uppercase  text-neutral-500 underline mt-3'>
            Basic Information
          </p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
            <p className='font-medium'>Gender: </p>
            {isEdit ? (
              <select
                className='max-w-20 bg-gray-100'
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
            ) : (
              <p className='text-gray-400'>{userData.gender}</p>
            )}
            <p className='font-medium'>Birthday: </p>
            {isEdit ? (
              <input
                className='max-w-20 bg-gray-100'
                type='date'
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                value={userData.dob}
              />
            ) : (
              <p className='text-gray-400'>{userData.dob}</p>
            )}
          </div>
        </div>
        <div className='mt-10'>
          {isEdit ? (
            <button
              className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer'
              onClick={updateUserProfileData}>
              Save Information
            </button>
          ) : (
            <button
              className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer'
              onClick={() => setIsEdit(true)}>
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default Profile;
