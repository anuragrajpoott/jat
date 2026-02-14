import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/*
  Jobs API
*/

export const fetchJobs = async () => {
  const res = await API.get("/jobs");
  return res.data;
};

export const createJob = async (data) => {
  const res = await API.post("/jobs", data);
  return res.data;
};

export const updateJob = async (id, data) => {
  const res = await API.put(`/jobs/${id}`, data);
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await API.delete(`/jobs/${id}`);
  return res.data;
};
