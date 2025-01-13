
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import UserService from '../../service/UserService';

const Asidebar = () => {
  const location = useLocation();
  const [user, setUser] = useState('');
  const [showGeneralSettings, setShowGeneralSettings] = useState(false); // For toggling child menu
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const response = await UserService.getUser(token);
          setUser(response.role);
        } else {
          console.error('No token found');
        }
      } catch (err) {
        console.error('Failed to verify user status:', err);
      }
    };

    checkUser();
  }, []);
  const toggleGeneralSettings = () => {
        setShowGeneralSettings(!showGeneralSettings);
      };
  return (
    <div className="w-52 h-screen mt-24 bg-gray-100 p-5 fixed top-0 left-0 overflow-y-auto shadow-lg">
      {user && (user === 'USER' || user === 'ADMIN') && (
        <>
          <NavLink
            to="/list-view"
            className={`block text-black px-4 py-2 mb-2 rounded ${
              location.pathname === '/list-view' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
            }`}
          >
            List View
          </NavLink>
          <NavLink
            to="/my-requests"
            className={`block text-black px-4 py-2 mb-2 rounded ${
              location.pathname === '/my-requests' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
            }`}
          >
            My Requests
          </NavLink>
        </>
      )}
      {user === 'ADMIN' && (
        <>
          <NavLink
            to="/admin-regularization"
            className={`block text-black px-4 py-2 mb-2 rounded ${
              location.pathname === '/admin-regularization'
                ? 'bg-green-500 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            Regularization
          </NavLink>
          <NavLink
            to="/admin-duty"
            className={`block text-black px-4 py-2 mb-2 rounded ${
              location.pathname === '/admin-duty' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
            }`}
          >
            On Duty
          </NavLink>
          <NavLink
            to="/admin-work-from-home"
            className={`block text-black px-4 py-2 mb-2 rounded ${
              location.pathname === '/admin-work-from-home'
                ? 'bg-green-500 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            Work From Home
          </NavLink>
          <NavLink
            to="/shift-schedule"
            className={`block text-black px-4 py-2 mb-2 rounded ${
              location.pathname === '/shift-schedule'
                ? 'bg-green-500 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            Shift Schedule
          </NavLink>
          <NavLink
            to="/approvals"
            className={`block text-black px-4 py-2 mb-2 rounded ${
              location.pathname === '/approvals' ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
            }`}
          >
            Approvals
          </NavLink>
        <div>
          <div
              onClick={toggleGeneralSettings}
              className="cursor-pointer text-black py-2 mb-2 transition duration-300 hover:bg-gray-300"
            >
              Settings
            </div>
            {showGeneralSettings && (
              <div className="pl-4">
                <NavLink
                  to="/settings/general-settings"
                  className={`block text-black py-2 mb-2 transition duration-300 ${
                    location.pathname.startsWith('/settings/general-settings')
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-300'
                  }`}
                >
                  General Settings
                </NavLink>
                <NavLink
                  to="/settings/user-specific-settings"
                  className={`block text-black py-2 mb-2 transition duration-300 ${
                    location.pathname.startsWith('/settings/user-specific-settings')
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-300'
                  }`}
                >
                  User Specific Settings
                </NavLink>
                <NavLink
                  to="/settings/approval-settings"
                  className={`block text-black py-2 mb-2 transition duration-300 ${
                    location.pathname.startsWith('/settings/approval-settings')
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-300'
                  }`}
                >
                  Approval Settings
                </NavLink>

                <NavLink
                  to="/settings/permissions-settings"
                  className={`block text-black py-2 mb-2 transition duration-300 ${
                    location.pathname.startsWith('/settings/permissions')
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-300'
                  }`}
                >
                  Permissions
                </NavLink>
                <NavLink
                  to="/settings/present-by-default"
                  className={`block text-black py-2 mb-2 transition duration-300 ${
                    location.pathname.startsWith('/settings/present-by-default')
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-300'
                  }`}
                >
                  Present By default
                </NavLink>
              </div>
            )}

          </div>
     
          <NavLink
            to="/users"
            className={`block text-black px-4 py-2 mb-2 rounded ${
              location.pathname.startsWith('/settings')
                ? 'bg-green-500 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            Users
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Asidebar;
