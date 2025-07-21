import axios from "axios";

const proxyServerClient = axios.create({
  baseURL: "http://172.16.100.8:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default proxyServerClient;
