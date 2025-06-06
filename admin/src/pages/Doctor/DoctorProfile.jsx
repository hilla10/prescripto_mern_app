import React from 'react';
import { useDoctorContext } from '../../context/DoctorContext';
import { useAppContext } from '../../context/AppContext';
import { useEffect } from 'react';
import { useState } from 'react';
import handleError from '../../errorHandler/error';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
  const { dToken, getProfileData, profileData, setProfileData, backendUrl } =
    useDoctorContext();

  const { currency } = useAppContext();

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fee: profileData.fee,
        available: profileData.available,
      };

      const { data } = await axios.put(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getProfileData();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className='flex flex-col gap-4 m-5'>
          <div>
            <img
              className='bg-primary/80 w-full sm:max-w-64 rounded-lg'
              src={profileData.image}
              alt=''
            />
          </div>

          <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white '>
            {/* -------- Doc Info : name, degree, experience --------- */}

            <p className='flex items-center gap-2 text-3xl font-medium text-gray-700 '>
              {profileData.name}
            </p>
            <div className='flex items-center gap-2 mt-1 text-gray-600 '>
              <p>
                {profileData.degree} - {profileData.specialty}
              </p>
              <button className='py-0.5 px-2 border border-gray-300 text-xs rounded-full '>
                {profileData.experience}
              </button>
            </div>

            {/* -------- Doc About --------- */}
            <div>
              <p className='flex items-center gap-2 text-sm font-medium text-neutral-800 mt-5'>
                About:{' '}
              </p>
              <p className='text-sm text-gray-600 max-w-[700px] mt-1 '>
                {profileData.about}
              </p>
            </div>

            <p className='text-gray-600 font-medium mt-4'>
              Appointment Fee:{' '}
              <span className='text-gray-800'>
                {currency}
                {isEdit ? (
                  <input
                    type='number'
                    value={profileData.fee}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fee: e.target.value,
                      }))
                    }
                  />
                ) : (
                  profileData.fee
                )}{' '}
              </span>
            </p>
            <div className='flex gap-2 py-2'>
              <p>Address:</p>
              <p className='text-sm '>
                {isEdit ? (
                  <input
                    type='text'
                    value={profileData.address.line1}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profileData.address.line1
                )}{' '}
                <br />{' '}
                {isEdit ? (
                  <input
                    type='text'
                    value={profileData.address.line2}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            <div className='flex gap-1 pt-2 '>
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                type='checkbox'
                id=''
              />
              <label htmlFor=''>Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={updateProfile}
                className='px-4 py-1 border border-primary text-sm rounded-full mt-5 cursor-pointer hover:bg-primary hover:text-white transition-all duration-500'>
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className='px-4 py-1 border border-primary text-sm rounded-full mt-5 cursor-pointer hover:bg-primary hover:text-white transition-all duration-500'>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
