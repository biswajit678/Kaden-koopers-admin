import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/profile");

// Banner
export const getBanners = () => api.get("/banner/");
export const getBannerById = (id) => api.get(`/banner/${id}`);
export const createBanner = (data) => api.post("/banner/create", data);
export const updateBanner = (id, data) => api.put(`/banner/${id}`, data);
export const deleteBanner = (id) => api.delete(`/banner/${id}`);

// Project
export const getProjects = () => api.get("/project/");
export const getProjectById = (id) => api.get(`/project/${id}`);
export const createProject = (data) => api.post("/project/create", data);
export const updateProject = (id, data) => api.put(`/project/${id}`, data);
export const deleteProject = (id) => api.delete(`/project/${id}`);
export const addImagesToProject = (id, data) => api.post(`/project/image/${id}`, data);
export const removeImageFromProject = (data) => api.put("/project/remove-image", data);

// Gallery
export const getGalleries = () => api.get("/gallery/");
export const getGalleryById = (id) => api.get(`/gallery/${id}`);
export const createGallery = (data) => api.post("/gallery/add", data);
export const updateGallery = (id, data) => api.put(`/gallery/${id}`, data);
export const deleteGallery = (id) => api.delete(`/gallery/${id}`);

// Service
export const getServices = () => api.get("/service/");
export const getServiceById = (id) => api.get(`/service/${id}`);
export const createService = (data) => api.post("/service/add", data);
export const updateService = (id, data) => api.put(`/service/${id}`, data);
export const deleteService = (id) => api.delete(`/service/${id}`);

// Contact
export const getContacts = () => api.get("/contact/");
