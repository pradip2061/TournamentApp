import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useState, ReactNode, useEffect } from 'react';

// Define Context Type
interface CheckAdminContextType {
  checkadmin: string;
  getdata:String,
  setCheckAdmin: (value: string) => void;
  setGetData: (value: string) => void;
  checkrole: () => Promise<void>;
}

// Create Context with Default Values
export const CheckAdminContext = createContext<CheckAdminContextType>({
  checkadmin: '',
  getdata:'',
  setGetData:()=>{},
  setCheckAdmin: () => {},
  checkrole: async () => {}
});

export const ContextApi = ({ children }: { children: ReactNode }) => {
  const [checkadmin, setCheckAdmin] = useState('');
const[getdata,setGetData]=useState('')
  // Function to Check Role
  const checkrole = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log("No token found!");
        return;
      }

      const response = await axios.get(
        `${process.env.baseUrl}/khelmela/checkrole`,
        {
          headers: { Authorization: `${token}` }
        }
      );
      
      setCheckAdmin(response.data.data.role);
    } catch (error) {
      console.log("Error fetching role:", error.response?.data?.message || error.message);
    }
  };



  return (
    <CheckAdminContext.Provider value={{ checkadmin, setCheckAdmin, checkrole,getdata,setGetData }}>
      {children}
    </CheckAdminContext.Provider>
  );
};
