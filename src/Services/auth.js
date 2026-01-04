import { BASE_URL} from '../utils/config';

export const register = async (username , password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
          roles: "USER", // Add multiple roles if needed: roles=USER&roles=ADMIN
        }),
      });
  
      const result = await response.text();
      console.log(result);
      return result
    } catch (err) {
      console.error("Registration error:", err);
    }
  };


  export const login = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.error("Login failed:", text);
        throw new Error("Login failed: " + text);
      }
  
      const data = await response.json();
      console.log("Login response:", data);
  
      if (data["JWT-TOKEN"]) {
        localStorage.setItem("token", data["JWT-TOKEN"]);
        localStorage.setItem('user_id', data["user_id"]);
        localStorage.setItem('username', data["username"]);
      }
  
      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };
  
  export const getusername = async (userid) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/getuser/1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
          roles: "USER", // Add multiple roles if needed: roles=USER&roles=ADMIN
        }),
      });
  
      const result = await response.text();
      console.log(result);
      return result
    } catch (err) {
      console.error("Registration error:", err);
    }
  };


  export const getuserid = async (username) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/getuserbymail/${username}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
  
      const user = await response.json(); 
      console.log(user);
  
      return user.id; 
    } catch (err) {
      console.error("Get user error:", err);
      return null;
    }
  };
  