import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from '../../assets/Icon.png';

import UserService from "../../service/UserService";

const LoginPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await UserService.login(email, password)
      console.log("user data message", userData)
      if (userData.token) {
        sessionStorage.setItem('token', userData.token)
        navigate('/list-view')
        window.location.reload();

      } else {
        setError(userData.message)
      }

    } catch (error) {
      console.log(error)
      setError(error.message)
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  }

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white p-16 shadow-lg flex flex-col items-center sm:flex-row">
      <img src={Icon} alt="Logo" className="w-112 mb-6 sm:mb-0 sm:mr-8" />
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Attendance</h1>
        <h4 className="text-md text-gray-600 mb-6">Enter your login credentials to access the dashboard</h4>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">Username:</label>
          <input
            type="email"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  </div>

  )
}

export default LoginPage


