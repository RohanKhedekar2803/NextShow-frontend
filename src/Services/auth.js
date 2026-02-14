

import api from "../utils/axiosInstance";
import { BASE_URL } from "../utils/config";

const formUrlEncoded = (data) => new URLSearchParams(data);

const JWT_TOKEN = localStorage.getItem('token'); // Replace with actual token

export const register = async (username, password) => {
  try {
    const response = await api.post(
      `${BASE_URL}/auth/register`,
      formUrlEncoded({
        username,
        password,
        roles: "USER",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(response.data);
    return response.data;

  } catch (err) {
    console.error("Registration error:", err);
    throw err;
  }
};


export const login = async (username, password) => {
  try {
    const response = await api.post(
      `${BASE_URL}/auth/login`,
      formUrlEncoded({
        username,
        password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;
    console.log("Login response:", data);
    
    const accessToken = data["JWT-ACCESS-TOKEN"];
    const refreshToken = data["JWT-REFRESH-TOKEN"];
    const usernameretirved = data.username;
    
    if (accessToken && refreshToken) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("username", usernameretirved);
    }

    return data;

  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

export const getUsername = async (userId) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JWT_TOKEN}`,
  };

  try {
    const response = await api.get(
      `${BASE_URL}/auth/getuser/${userId}`
    ,headers);

    console.log(response.data);
    return response.data;

  } catch (err) {
    console.error("Get username error:", err);
    throw err;
  }
};

export const getUserId = async (username) => {

  try {
    const response = await api.get(
      `${BASE_URL}/auth/getuserbymail/${username}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }
    );

    console.log(response.data);
    return response.data.id;

  } catch (err) {
    console.error("Get user error:", err);
    return null;
  }
};

  