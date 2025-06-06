import { toast } from 'react-toastify';
const handleError = (error) => {
  console.log(error);
  if (error.response && error.response.data && error.response.data.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error(error.message);
  }
};

export default handleError;
