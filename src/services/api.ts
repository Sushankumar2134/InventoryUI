// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://api.example.com",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = "YOUR_TOKEN";
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "https://tamala-unsighing-quadrennially.ngrok-free.dev/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;