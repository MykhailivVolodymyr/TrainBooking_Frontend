import axios from 'axios';
import { UserLogin, UserRegister } from '@/types/user';


export const registerUser = async (userData: UserRegister): Promise<any> => {
    try {
      const url = 'https://localhost:7160/api/User/register';
      const response = await axios.post(url, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.error) {
        console.error('Помилка реєстрації від сервера:', error.response.data.error);
        throw new Error(error.response.data.error);
      } else if (axios.isAxiosError(error) && error.response) {
        console.error('Помилка реєстрації:', error.response.status);
        throw new Error(`Помилка реєстрації: ${error.response.status}`);
      } else {
        console.error('Невідома помилка при реєстрації:', error);
        throw new Error('Невідома помилка при реєстрації');
      }
    }
  };



export const loginUser = async (userData: UserLogin): Promise<any> => {
    try {
      const url = 'https://localhost:7160/api/User/login';
      const response = await axios.post(url, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.error) {
        console.error('Помилка входу від сервера:', error.response.data.error);
        throw new Error(error.response.data.error);
      } else if (axios.isAxiosError(error) && error.response) {
        console.error('Помилка входу:', error.response.status);
        throw new Error(`Помилка входу: ${error.response.status}`);
      } else {
        console.error('Невідома помилка при вході:', error);
        throw new Error('Невідома помилка при вході');
      }
    }
  };


export const logoutUser = async (): Promise<void> => {
  try {
    const url = 'https://localhost:7160/api/User/logout';
    const response = await axios.post(
      url,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      }
    );
    console.log('Успішний вихід:', response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.error) {
      console.error('Помилка виходу від сервера:', error.response.data.error);
      throw new Error(error.response.data.error);
    } else if (axios.isAxiosError(error) && error.response) {
      console.error('Помилка виходу:', error.response.status);
      throw new Error(`Помилка виходу: ${error.response.status}`);
    } else {
      console.error('Невідома помилка при виході:', error);
      throw new Error('Невідома помилка при виході');
    }
  }
};