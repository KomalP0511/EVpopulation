

import React from 'react';
import { MdAccountCircle } from "react-icons/md";
import Icon from "../../assets/Icon.png";

import { useNavigate } from 'react-router-dom';
import UserService from '../../service/UserService';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    UserService.logout(); // Clear the token and other data
    navigate('/');
    window.location.reload(); // Redirect to login page
  };

  return (
    <nav className="bg-green-300 fixed top-0 left-0 right-0 z-50 shadow-md flex items-center justify-between px-5 py-3">
    <div className="flex items-center">
      <div className="mr-4">
        <img src={Icon} alt="Nav Icon" className="w-12 h-12" />
      </div>
      <h5 className="text-black text-lg font-bold">Home / Attendance</h5>
    </div>
    <div className="flex items-center">
      <MdAccountCircle
        className="text-black text-3xl cursor-pointer hover:text-gray-500"
        onClick={handleLogout}
      />
    </div>
  </nav>
);
};

export default Navbar;









