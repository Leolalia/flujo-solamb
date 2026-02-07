import axios from "axios";

export const edgeApi = axios.create({
  baseURL: "http://localhost:7789",
  timeout: 5000,
});
