import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const analyzeSoil = (data) =>
  API.post("/analyze", data);

export const compareCrops = (data) =>
  API.post("/compare-crops", data);

export const chatWithBot = (data) =>
  API.post("/chat", data);

export default API;