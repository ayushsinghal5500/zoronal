import axios from "axios";

// For Production (Render)
const baseURL = "https://zoronalbackend.onrender.com/api";

// For Development (Local)
// const baseURL = "http://localhost:5002/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const createCompany = (companyData) => {
  return api.post("/companies/create", companyData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCompanies = (search = "", page = 1, limit = 10) => {
  return api.get(`/companies/all?search=${search}&page=${page}&limit=${limit}`);
};

export const getSingleCompany = (companyId) => {
  return api.get(`/companies/${companyId}`);
};

export const addReview = (reviewData) => {
  return api.post("/reviews/add", reviewData);
};

export const getReviews = (companyId, page = 1, limit = 10) => {
  return api.get(`/reviews/company/${companyId}?page=${page}&limit=${limit}`);
};

export const likeReview = (reviewId, action = 'like') => {
  return api.post(`/reviews/${reviewId}/like`, { action });
};

export const dislikeReview = (reviewId, action = 'dislike') => {
  return api.post(`/reviews/${reviewId}/dislike`, { action });
};

export const addCommentToReview = (reviewId, commentData) => {
  return api.post(`/reviews/${reviewId}/comment`, commentData);
};