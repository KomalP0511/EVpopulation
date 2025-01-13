import React, { createContext, useEffect, useState } from 'react';
import UserService from '../../service/UserService';


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await UserService.getUser();
      
      console.log("auth user", response);
      if (response.data) {
        console.log(response.data)
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };
  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await UserService.logout()
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};











// ​import React, { createContext, useEffect, useState } from 'react';
// import UserService from '../../service/UserService';


// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = sessionStorage.getItem('token');
//         if (token) {
//           // Simulating API call to get user details
//           const userData = await UserService.getUser(token);
//           setUser(userData);
//         }
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

