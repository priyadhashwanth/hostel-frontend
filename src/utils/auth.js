// ✅ Get stored user safely
export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
     if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch (error) {
    return null;
  }
};

// ✅ Get role (admin / staff / resident)
export const getRole = () => {
  const user = getUser();
  return user?.role || null;
};

// ✅ Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// ✅ Check if logged in
export const isLoggedIn = () => {
  return !!getToken();
};

// ✅ Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
