import { useState, useContext, createContext, useEffect } from "react";
import { Cookies } from "react-cookie";
import AuthService from "../services/auth.service";

const cookies = new Cookies();

const AuthContext = createContext(null);
// ฟังก์ชันใหม่ getUser สำหรับการดึงข้อมูลผู้ใช้
const getUser = () => {
  const savedUser = cookies.get("user") || null;
  return savedUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };



  useEffect(() => {
    cookies.set("user", JSON.stringify(user), {
      path: "/",
      expires: new Date(Date.now() + 86400 * 1000),
    });
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
