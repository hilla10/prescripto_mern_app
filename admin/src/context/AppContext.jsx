import { createContext, useContext } from 'react';

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppContextProvider = ({ children }) => {
  const currency = '$';

  const calculateAge = (dob) => {
    const today = new Date();
    const birthData = new Date(dob);

    const age = today.getFullYear() - birthData.getFullYear();

    return age;
  };

  const months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('/');
    return (
      dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
    );
  };

  const value = {
    calculateAge,
    slotDateFormat,
    currency,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
