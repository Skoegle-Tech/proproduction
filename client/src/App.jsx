import React, { Suspense, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useStore } from "./Store/Store";
import { Box, CircularProgress } from "@mui/material";
import Live from "./Pages/Live/Live";
import Track from "./Pages/Track";
import Profile from "./Pages/Profile";
import Admin from "./Pages/Admin/Admin";
import Forgotpassword from "./Pages/Forgotpassword";
import Verifypassword from "./Pages/Verifypassword";
import PageNotFound from "./Pages/PageNotFound";
import ServerMaintenance from "./Pages/ServerMaintenance";
import NoInterNet from "./Pages/NoInterNet";
import LoadingScreen from "./Pages/LoadingScreen";
import LiveMaper from "./Pages/LiveMaper";

// Lazy loading components
const Login = React.lazy(() => import("./Pages/Login"));
const SignUp = React.lazy(() => import("./Pages/Signup"));
const Setings = React.lazy(() => import("./Pages/Register/Setings"));

// Simple loading indicator for lazy-loaded components
function Loading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
}

export default function App() {
  const { isLogin, isAdmin } = useStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  // const [serverStatus, setServerStatus] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  
  // Configure maintenance mode
  const forceMaintenance = false;
  const isUnderMaintenance = forceMaintenance;

  // Route guards
  const GuestRoute = ({ element }) => (!isLogin ? element : <Navigate to="/" />);
  const ProtectedRoute = ({ element }) => (isLogin ? element : <Navigate to="/login" />);
  const AdminRoute = ({ element }) => (isLogin && isAdmin ? element : <Navigate to="/login" />);
  
  // Initial loading screen logic - show only once per tab session
  useEffect(() => {
    const hasLoadedBefore = sessionStorage.getItem('initialLoadingShown');
    
    if (!hasLoadedBefore) {
      setShowLoadingScreen(true);
      
      // After 5 seconds (or adjust as needed), hide loading screen
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
        setInitialLoading(false);
        // Mark as shown for this session
        sessionStorage.setItem('initialLoadingShown', 'true');
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      // Skip loading screen if already shown in this session
      setInitialLoading(false);
    }
  }, []);
  
  // Network status listener
  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // Router configuration
  const router = createBrowserRouter([
    {
      path: "/",
      element: isUnderMaintenance ? <ServerMaintenance /> : <ProtectedRoute element={<Live />} />,
      errorElement: isUnderMaintenance ? <ServerMaintenance /> : <PageNotFound />
    },
    {
      path: "/signup",
      element: isUnderMaintenance ? <ServerMaintenance /> : <GuestRoute element={<SignUp />} />,
    },
    {
      path: "/login",
      element: isUnderMaintenance ? <ServerMaintenance /> : <GuestRoute element={<Login />} />,
    },
    {
      path: "/forgotpassword",
      element: isUnderMaintenance ? <ServerMaintenance /> : <GuestRoute element={<Forgotpassword />} />,
    },
    {
      path: "/Verifypassword",
      element: isUnderMaintenance ? <ServerMaintenance /> : <GuestRoute element={<Verifypassword />} />,
    },
    {
      path: "/settings",
      element: isUnderMaintenance ? <ServerMaintenance /> : <ProtectedRoute element={<Setings />} />,
    },
    {
      path: "/track",
      element: isUnderMaintenance ? <ServerMaintenance /> : <ProtectedRoute element={<Track />} />,
    },
    {
      path: "/profile",
      element: isUnderMaintenance ? <ServerMaintenance /> : <ProtectedRoute element={<Profile />} />,
    },
    {
      path: "/admin",
      element: isUnderMaintenance ? <ServerMaintenance /> : <AdminRoute element={<Admin />} />,
    },
    {
      path: "/livemaper",
      element: isUnderMaintenance ? <ServerMaintenance /> : <LiveMaper/>,
    },
  ]);

  // Render decisions
  
  // Show loading screen on first visit in this tab
  if (false) {
    return <LoadingScreen />;
  }
  
  // Show no internet screen if offline
  if (!isOnline) {
    return <NoInterNet />;
  }
  
  // Show router once initial loading is complete
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}