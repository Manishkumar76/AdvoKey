import { getDataFromToken } from "@/helpers/getDataFromToken";
import { useEffect } from "react";

const Topbar = () => {
    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logout clicked");
        }
        const getUser= async () =>{
            const userId= await getDataFromToken();
            if (userId) {
                const response = await fetch(`/api/users/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    return data;
                } else {
                    console.error("Failed to fetch user data");
                }
               
            }
            return null;
        }
        useEffect(() => {
            const fetchUser = async () => {
                const user = await getUser();
                if (user) {
                    console.log("User data:", user);
                }
            };
            fetchUser();
        }, []);
    return (
      <header className="bg-gray-300 shadow-md p-4 flex items-center justify-between">
        <h1 className="text-lg text-center font-semibold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">admin@lawsite.com</span>
          <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>
      </header>
    );
  };
  
  export default Topbar;
  