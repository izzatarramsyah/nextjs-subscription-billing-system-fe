import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const register = async (data: {
  role: string;
  email: string;
  password: string;
}) => {
  return await axios.post(`${API_BASE_URL}/register`, data);
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  return await axios.post(`${API_BASE_URL}/login`, data);
};