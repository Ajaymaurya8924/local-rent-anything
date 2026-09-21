import api from "../api/axios";

// ================= REGISTER =================

const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= LOGIN =================

const loginUser = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= GET CURRENT USER =================

const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================= LOGOUT =================

const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (profileData) => {
    try {
        const response = await api.patch(
            "/auth/profile",
            profileData
        );

        return response.data;

    } catch (error) {
        throw error;
    }
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateProfile
};