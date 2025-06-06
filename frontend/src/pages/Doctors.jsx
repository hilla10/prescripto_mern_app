import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Doctors = () => {
  const { specialty } = useParams();
  const { doctors } = useAppContext();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (specialty) {
      setFilterDoc(doctors.filter((doc) => doc.specialty === specialty));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, specialty]);

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          className={`py-1 px-3 border border-gray-300 rounded text-sm transition-all sm:hidden cursor-pointer ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
          onClick={() => setShowFilter((prev) => !prev)}>
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600  ${
            showFilter ? 'flex' : 'hidden sm:flex'
          }`}>
          <p
            onClick={() =>
              specialty === 'General physician'
                ? navigate('/doctors')
                : navigate('/doctors/General physician')
            }
            className={`custom-style ${
              specialty === 'General physician'
                ? 'bg-indigo-100 text-black'
                : ''
            }`}>
            General physician
          </p>
          <p
            onClick={() =>
              specialty === 'Gynecologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gynecologist')
            }
            className={`custom-style ${
              specialty === 'Gynecologist' ? 'bg-indigo-100 text-black' : ''
            }`}>
            Gynecologist
          </p>
          <p
            onClick={() =>
              specialty === 'Dermatologist'
                ? navigate('/doctors')
                : navigate('/doctors/Dermatologist')
            }
            className={`custom-style ${
              specialty === 'Dermatologist' ? 'bg-indigo-100 text-black' : ''
            }`}>
            Dermatologist
          </p>
          <p
            onClick={() =>
              specialty === 'Pediatricians'
                ? navigate('/doctors')
                : navigate('/doctors/Pediatricians')
            }
            className={`custom-style ${
              specialty === 'Pediatricians' ? 'bg-indigo-100 text-black' : ''
            }`}>
            Pediatricians
          </p>
          <p
            onClick={() =>
              specialty === 'Neurologist'
                ? navigate('/doctors')
                : navigate('/doctors/Neurologist')
            }
            className={`custom-style ${
              specialty === 'Neurologist' ? 'bg-indigo-100 text-black' : ''
            }`}>
            Neurologist
          </p>
          <p
            onClick={() =>
              specialty === 'Gastroenterologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gastroenterologist')
            }
            className={`custom-style ${
              specialty === 'Gastroenterologist'
                ? 'bg-indigo-100 text-black'
                : ''
            }`}>
            Gastroenterologist
          </p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map(({ _id, name, image, specialty, available }) => (
            <div
              onClick={() => navigate(`/appointment/${_id}`)}
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
      </div>
    </div>
  );
};

export default Doctors;
