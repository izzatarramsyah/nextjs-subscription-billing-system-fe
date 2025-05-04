import axios from "axios";
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const getDashboardInfo = async () => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/dashboard/`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};


export const getAllUsers = async () => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/user/getListUsers`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const updateUser = async (data: {
  id: string;
  email: string;
  password: string;
  role: string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.post(`${API_BASE_URL}/user/updateUser`,data,
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data;
};

export const deleteUser = async (data: {
  id: string;
  status: string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.post(`${API_BASE_URL}/user/updateUserStatus`,data,
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );
  return response.data;
};

export const getUserByRole = async (data : {
  role: string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/user/GetByRole/${data.role}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getUserByID = async (data : {
  id: string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/user/getByID/${data.id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getUser = async () => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/user/getUser`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getProducts = async () => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/product/getListProduct`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getProductByID = async ( data : {
  id:string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/product/getByID/${data.id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getProductsByOwnerID = async () => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/product/getByOwnerID`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const updateStatusProduct = async (data: {
  id: string;
  status: string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.post(
    `${API_BASE_URL}/product/UpdateStatusProduct/${data.id}`,
    { status: data.status }, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const createPlan = async ( data : {
  ProductID : string;
  Name : string;
  Price : number;
  DurationMonths : number;
}) => {
  const token = Cookies.get('token');
  const response = await axios.post(`${API_BASE_URL}/plan/createPlan`, data, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getPlans = async () => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/plan/getListPlans`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getPlanById = async ( data : {
  id:string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/plan/getByID/${data.id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getPlanByProductId = async ( data : {
  id:string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/plan/getByProductID/${data.id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getLibraryByUserID = async () => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/library/getByID`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const subscribe = async ( data : {
  plan_id: string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.post(`${API_BASE_URL}/subscription/Subscribe`, data, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const payment = async ( data : {
  SubscriptionID: string;
  Amount: string;
  PaymentMethod: string;
}) => {
  const token = Cookies.get('token');
  const response = await axios.post(`${API_BASE_URL}/payment/CreatePayment`, data, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getByOwnerID = async () => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/subscriber/getByOwnerID`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getSubscribersByOwnerID = async () => {
  const token = Cookies.get('token');
  const response = await axios.get(`${API_BASE_URL}/subscriber/getByOwnerID`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};


export const getRevenueReport = async ( data : {
   start_date : string,
   end_date: string
}) => {
  const token = Cookies.get('token'); 
  const response = await axios.post(`${API_BASE_URL}/report/getRevenueReport`, data, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

export const getEvents = async ()  => {
 const token = Cookies.get('token'); 
 const response = await axios.get(`${API_BASE_URL}/reaminder/getAll`, {
   headers: {
     Authorization: `${token}`,
   },
 });
 return response.data;
};

export const addEventCalender = async ( data : {
  Type : string,
  Title: string,
  Description: string,
  ReminderDate: string,
}) => {
 const token = Cookies.get('token'); 
 const response = await axios.post(`${API_BASE_URL}/reaminder/create`, data, {
   headers: {
     Authorization: `${token}`,
   },
 });
 return response.data;
};

export const addProduct = async (data: {
  Name: string;
  Description: string;
  OwnerID: string;
  File: File;  
}) => {
  const token = Cookies.get('token'); 
  
  const formData = new FormData();
  formData.append('Name', data.Name);
  formData.append('Description', data.Description);
  formData.append('OwnerID', data.OwnerID);
  formData.append('File', data.File); 

  try {
    const response = await axios.post(`${API_BASE_URL}/product/createProduct`, formData, {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'multipart/form-data',  
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading product:', error);
    throw error; 
  }
};

export const getAccessProduct = async (data: {
  id: string;
}) => {
  const token = Cookies.get('token'); 
  try {
    const response = await axios.get(`${API_BASE_URL}/ebook/getAccess/${data.id}`, {
      headers: {
        'Authorization': `${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading product:', error);
    throw error; 
  }
};

export const serveProduct = async (data: {
  fileUrl: string;
}) => {
  const token = Cookies.get('token'); 
  try {
    const response = await axios.post(`${API_BASE_URL}/ebook/serve`, data, {
      headers: {
        'Authorization': `${token}`,
      },
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error uploading product:', error);
    throw error; 
  }
};
