import axios from "axios";

const API = axios.create({
  baseURL: "https://jat-w89i.onrender.com/api",
});

/*
  Fetch Jobs (with optional query string)
  Example:
  fetchJobs("status=applied&search=google")
*/
export const fetchJobs = async (query = "") => {
  const res = await API.get(`/jobs${query ? `?${query}` : ""}`);
  return res.data; // returns { success, count, data }
};

export const createJob = async (data) => {
  const res = await API.post("/jobs", data);
  return res.data; // returns { success, data }
};

export const updateJob = async (id, data) => {
  const res = await API.patch(`/jobs/${id}`, data);
  return res.data; // PATCH instead of PUT
};

export const deleteJob = async (id) => {
  const res = await API.delete(`/jobs/${id}`);
  return res.data;
};
