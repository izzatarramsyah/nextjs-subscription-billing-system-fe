
import { request } from './apiHelper';

// Dashboard
export const getDashboardInfo = () => request.get('/dashboard/');

// User
export const getAllUsers = () => request.get('/user/getListUsers');
export const getUserByRole = (role: string) => request.get(`/user/GetByRole/${role}`);
export const getUserByID = (id: string) => request.get(`/user/getByID/${id}`);
export const getUser = () => request.get('/user/getUser');
export const updateUser = (data: any) => request.post('/user/updateUser', data);
export const updateStatusUser = (data: any) => request.post('/user/updateUserStatus', data);
export const deleteUser = (id: string) => request.get(`/user/deleteUser?id=${id}`);

// Product
export const getProducts = () => request.get('/product/getListProduct');
export const updateStatusProduct = (data : {
  id : string;
  status: string;
}) => request.post(`/product/updateStatusProduct`, data);
export const getProductByID = (id: string) => request.get(`/product/getByID/${id}`);
export const getProductsByOwnerID = () => request.get(`/product/getByOwnerID`);
export const updateProduct = (data: {
    ProductId: string;
    Name: string;
    Description: string;
    OwnerID: string;
    File: File;
  }) => {
    const formData = new FormData();
    
    // Menambahkan data ke FormData
    formData.append('ID', data.ProductId);
    formData.append('Name', data.Name);
    formData.append('Description', data.Description);
    formData.append('OwnerID', data.OwnerID);
    formData.append('File', data.File);
  
    return request.upload('/product/updateProduct', formData);
};
export const addProduct = (data: {
    Name: string;
    Description: string;
    OwnerID: string;
    File: File;
  }) => {
    const formData = new FormData();
    
    // Menambahkan data ke FormData
    formData.append('Name', data.Name);
    formData.append('Description', data.Description);
    formData.append('OwnerID', data.OwnerID);
    formData.append('File', data.File);
  
    return request.upload('/product/createProduct', formData);
};

// Plan
export const createPlan = (data: any) => request.post('/plan/createPlan', data);
export const updatePlan = (data: any) => request.post('/plan/updatePlan', data);
export const deletePlan = (id: string) => request.delete(`/plan/deletePlan/${id}`);
export const getPlans = () => request.get('/plan/getListPlans');
export const getPlanById = (id: string) => request.get(`/plan/getByID/${id}`);
export const getPlanByProductId = (id: string) => request.get(`/plan/getByProductID/${id}`);

// Report
export const getRevenueReport = (data: { start_date: string; end_date: string }) => request.post('/report/getRevenueReport', data);

// Ebook
export const getAccessProduct = (id: string) => request.get(`/ebook/getAccess/${id}`);
export const serveProduct = (data: any) => request.postWithBlob('/ebook/serve', data);

//Subscription
export const subscribe = (data: any) => request.post('/subscription/Subscribe', data);

//Payment
export const payment = (data: any) => request.post('/payment/CreatePayment', data);
export const getAllPaymentDetails = () => request.get('/payment/GetAllPaymentDetails');
export const updatePaymentStatus = (data : {
  id : string;
  status: string;
}) => request.post(`/payment/updatePaymentStatus`, data);

//Library
export const getLibraryByUserID = () => request.get('/library/getByID');

//Calender
export const getEvents = () => request.get('/reminder/getAll');
export const addEventCalender = (data: any) => request.post('/reminder/create', data);

// Subscriber
export const getSubscribersByOwnerID = () => request.get('/subscriber/getByOwnerID');