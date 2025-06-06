import { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import handleError from '../errorHandler/error';

const Verify = () => {
  const { token, backendUrl } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const success = searchParams.get('success');
  const appointmentId = searchParams.get('appointmentId');

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/verifyStripe`,
        { success, appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        navigate('/my-appointments');
      } else {
        navigate('/cart');
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return <div></div>;
};

export default Verify;
