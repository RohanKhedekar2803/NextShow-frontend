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

export default function SignUp() {
  const handleSignUpClick = (event) => {
    event.preventDefault();
    console.log("Sign Up button clicked");
  };

  const handleLoginClick = (event) => {
    event.preventDefault();
    console.log("Login button clicked");
  };

  const handleGoogleClick = (event) => {
    event.preventDefault();
    console.log("Continue with Google button clicked");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <Card className="bg-white w-full max-w-md shadow-md rounded-lg p-6 space-y-6">
        <CardHeader>
          <CardTitle className="text-gray-900 text-2xl">Welcome to Nextshow</CardTitle>
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
              <Input id="email" type="email" placeholder="example@email.com" />
            </div>
            <div>
              <Label htmlFor="password" className="block text-gray-800 mb-1">
                Password
              </Label>
              <Input id="password" type="password" />
            </div>
            <div className="flex space-x-4">
              <Button className="w-full bg-blue-600 text-white" onClick={handleSignUpClick}>
                Sign Up
              </Button>
              <Button className="w-full bg-gray-200 text-gray-800" onClick={handleLoginClick}>
                Login
              </Button>
            </div>
            <Button className="w-full bg-red-500 text-white flex items-center justify-center gap-2" onClick={handleGoogleClick}>
              <FaGoogle /> Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
