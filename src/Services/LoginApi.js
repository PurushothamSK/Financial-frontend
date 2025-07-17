import axios from "axios";
const BaseUrl = import.meta.env.VITE_API_URL;


const loginApi = async(data) => {
  try {
    const response = await axios.post(`${BaseUrl}auth/login`, data);
    return { res: response.data, success: true };
  } catch (error) {
    const backendMessage = error.response?.data?.message || 'Login API Failed!';
    return { success: false, message: backendMessage };
  }
};


const registerApi = async(data) => {
  try {
    const response = await axios.post(`${BaseUrl}auth/register`, data);
    return { res: response.data, success: true };
  } catch (error) {
    const backendMessage = error.response?.data?.message || 'Register API Failed!';
    return { success: false, message: backendMessage };
  }
};


// User Screen API

const basicInfo = async (payload, token) => {
  try {
    const response = await axios.post(
      `${BaseUrl}user/basic-info`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    return { res: response.data, success: true };
  } catch (error) {
    const backendMessage = error.response?.data?.message || 'Register API Failed!';
    return { success: false, message: backendMessage };
  }
};

const income  = async (payload, token) => {
  try {
    const response = await axios.post(
      `${BaseUrl}user/income`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    return { res: response.data, success: true };
  } catch (error) {
    const backendMessage = error.response?.data?.message || 'Register API Failed!';
    return { success: false, message: backendMessage };
  }
};

 const getIncome = async (token) => {
  try {
    const response = await axios.get(`${BaseUrl}user/income`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
     console.log("Income response:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch income";
    return { success: false, message };
  }
};


const postExpense = async (data, token) => {
  try {
    const response = await axios.post(`${BaseUrl}user/expense`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, res: response.data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch income";
    return { success: false, message };
  }
};


const postInvestment = async (data, token) => {
  try {
    const response = await axios.post(`${BaseUrl}user/investment`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, res: response.data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch income";
    return { success: false, message };
  }
};

const postRetirement = async (data, token) => {
  try {
    const response = await axios.post(`${BaseUrl}user/retirement`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, res: response.data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch income";
    return { success: false, message };
  }
};



const tableResult = async (token) => {
  try {
    const response = await axios.get(`${BaseUrl}user/simulate-retirement`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Income response table:", response.data);
    return { success: true, res: response.data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch income";
    return { success: false, message };
  }
};


const getUser = async (token) => {
  try {
    const response = await axios.get(`${BaseUrl}user/get-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, res: response.data };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch income";
    return { success: false, message };
  }
};




export { loginApi, registerApi, basicInfo, income, getIncome, postExpense, postInvestment, postRetirement, tableResult, getUser };