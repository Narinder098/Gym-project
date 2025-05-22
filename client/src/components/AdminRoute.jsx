import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  // While loading, render nothing or a loading indicator
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to home (or unauthorized page) if not admin
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;