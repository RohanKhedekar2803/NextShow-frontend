import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import {register , login}  from "@/Services/auth";
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.(com)$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const handleSignUpClick = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Sign Up button clicked");
      try {
        const data = await register(email, password);
        console.log(data);
        if (data === "User registered successfully!") {
          alert("User Registered! Please login.");
        } else {
          alert("Registration failed please user unique email");
        }
      } catch (error) {
        alert("Error occurred: " + error.message);
      }
    }
  };
  const handleLoginClick = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Login button clicked");
      try {
        const data = await login(email, password);
        if (data && data["JWT-TOKEN"]) {
           navigate(`/homepage`);
          // Optionally redirect or update UI here
        } else {
          alert("Login failed. Please check your credentials.");
        }
      } catch (error) {
        alert("Error during login: " + error.message);
      }
    }
  };
  
  

  const handleGoogleClick = (event) => {
    event.preventDefault();
    const clientId =
      "1013179941500-37ijcddmm4l7mpe4ve55351cmqkklulk.apps.googleusercontent.com";
    const redirectUri = "http://localhost:8080/auth/google/callback";
    const responseType = "code";
    const scope = "openid email profile";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <Card className="bg-white w-full max-w-md shadow-md rounded-lg p-6 space-y-6">
        <CardHeader>
          <CardTitle className="text-gray-900 text-2xl">
            Welcome to Nextshow
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your information to use Nextshow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-gray-800 mb-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-gray-800 mb-1">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex space-x-4">
              <Button
                className="w-full bg-blue-600 text-white"
                onClick={handleSignUpClick}
              >
                Sign Up
              </Button>
              <Button
                className="w-full bg-gray-200 text-gray-800"
                onClick={handleLoginClick}
              >
                Login
              </Button>
            </div>
            <Button
              className="w-full bg-red-500 text-white flex items-center justify-center gap-2"
              onClick={handleGoogleClick}
            >
              <FaGoogle /> Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
