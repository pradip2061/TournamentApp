import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { BASE_URL } from '../../env';

// Define Context Type
interface CheckAdminContextType {
  checkadmin: string;
  setCheckAdmin: (value: string) => void;
  setTrigger: (value: string) => void;
  checkrole: () => Promise<void>;
  data: any;
  trigger:any;
  getProfile: () => Promise<void>;
}

// Create Context with Default Values
export const CheckAdminContext = createContext<CheckAdminContextType>({
  checkadmin: '',
  setCheckAdmin: () => {},
  checkrole: async () => {},
  data: null,
  trigger:null,
  setTrigger:()=>{},
  getProfile: async () => {}
});

export const ContextApi = ({ children }: { children: ReactNode }) => {
  const [checkadmin, setCheckAdmin] = useState('');
  const [data, setData] = useState<any>(null);
  const[trigger,setTrigger]=useState<any>(null)

  // Function to Check Role
  const checkrole = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log("No token found!");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/khelmela/checkrole`, // Use uppercase BASE_URL for env
        { headers: { Authorization: token } }
      );
      
      setCheckAdmin(response.data.data.role);
    } catch (error: any) {
      console.error("Error fetching role:", error.response?.data?.message || error.message);
    }
  };

  // Function to Fetch Profile Data
  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log("No token found!");
        return;
      }

      const response = await axios.get(`${BASE_URL}/khelmela/getprofile`, {
        headers: { Authorization: `${token}` }
      });

      setData(response.data.data);
    } catch (error: any) {
      console.error("Error fetching profile:", error.response?.data?.message || error.message);
    }
  };

  useEffect(()=>{
    getProfile()
  },[])
  // Fetch Profile on Mount

  return (
    <CheckAdminContext.Provider value={{ checkadmin, setCheckAdmin, checkrole, data,trigger,setTrigger,getProfile }}>
      {children}
    </CheckAdminContext.Provider>
  );
};
