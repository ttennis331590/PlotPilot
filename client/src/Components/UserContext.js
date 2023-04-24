import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load the user from local storage when the component is mounted
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && user.username) {
      console.log('User state:', user);
    }
  }, [user]);

  const fetchUsername = async (id) => {
    console.log("fetching username")
    console.log(id)
    try {
      const response = await fetch(
        `http://localhost:3001/userInfoId?id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setUser((prevState) => ({ ...prevState, username: data.username }));
      } else {
        console.error(
          "Error fetching username:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };
  

  // Save the user to local storage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    fetchUsername(userData.id);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, login, logout, fetchUsername }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
