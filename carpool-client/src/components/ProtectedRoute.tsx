import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute() {
	const { isSignedIn } = useAuth();

	if (!isSignedIn) {
		return <Navigate to="/sign-in" replace />;
	}

	return <Outlet />;
}
