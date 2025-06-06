import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import handleError from '../errorHandler/error';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const navigate = useNavigate();

  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useAppContext();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchDocInfo = async () => {
    try {
      const docInfo = doctors.find((doc) => doc._id === docId);
      setDocInfo(docInfo);
    } catch (error) {
      handleError(error);
    }
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    // getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentData = new Date(today);
      currentData.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentData.getDate()) {
        currentData.setHours(
          currentData.getHours() > 10 ? currentData.getHours() + 1 : 10
        );
        currentData.setMinutes(currentData.getMinutes() > 30 ? 30 : 0);
      } else {
        currentData.setHours(10);
        currentData.setMinutes(0);
      }

      let timeSlots = [];

      while (currentData < endTime) {
        let formattedTime = currentData.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        let day = currentData.getDate();
        let month = currentData.getMonth() + 1;
        let year = currentData.getFullYear();

        const slotDate = day + '/' + month + '/' + year;

        const slotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          // add slot to array
          timeSlots.push({
            datetime: new Date(currentData),
            time: formattedTime,
          });
        }

        // increment current type by 30 minutes
        currentData.setMinutes(currentData.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + '/' + month + '/' + year;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await getDoctorsData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo && docInfo.slots_booked) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, []);

  return (
    docInfo && (
      <div>
        {/* ************** Doctor Details ************** */}
        <div className='flex flex-col sm:flex-row gap-4 '>
          <div>
            <img
              className='bg-primary w-full sm:max-w-72 rounded-lg'
              src={docInfo.image}
              alt=''
            />
          </div>
          <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            {/* ************** Doctor Info : name, degree, experience ************** */}

            <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
              {docInfo.name} <img src={assets.verified_icon} alt='' />
            </p>
            <div className='flex items-center gap-2 mt-1 text-gray-600'>
              <p>
                {docInfo.degree} - {docInfo.specialty}
              </p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>
                {docInfo.experience}{' '}
              </button>
            </div>

            {/* ************** Doctor About ************** */}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img className='w-3' src={assets.info_icon} alt='' />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
                {docInfo.about}
              </p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee:{' '}
              <span className='text-gray-600'>
                {currencySymbol}
                {docInfo.fee}
              </span>
            </p>
          </div>
        </div>

        {/* ********** Booking Slots ********** */}

        <div className='sm:ml-72 sm:pl-4 ml-4 font-medium text-gray-700'>
          <p>Booking slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? 'bg-primary text-white '
                      : 'border border-gray-300'
                  }`}>
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 '>
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? 'bg-primary text-white'
                      : ' text-gray-400 border border-gray-300'
                  }`}
                  key={index}>
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6 cursor-pointer'>
            Book an appointment
          </button>
        </div>

        {/* ********* Listing Related Doctors ********** */}

        <RelatedDoctors docId={docId} specialty={docInfo.specialty} />
      </div>
    )
  );
};

export default Appointment;
