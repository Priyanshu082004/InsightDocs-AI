import axios from  "axios";

const client = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
     timeout: 10000,
    withCredentials: true,
    headers: {
    "Content-Type": "application/json",
  },
});