import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import './index.css';
import AppErrorBoundary from './components/AppErrorBoundary.tsx';
import Layout from './Layout.tsx';
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';
import Dashboard from './pages/Dashboard.tsx';
import CreateFamily from './pages/CreateFamily.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import EditAddress from './pages/EditAddress.tsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error('Add your Clerk Publishable Key to the .env file');
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppErrorBoundary>
			<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Layout />}>
							{/* Public Routes */}
							<Route index element={<Home />} />
							<Route
								path="sign-in/*"
								element={<SignIn routing="path" path="/sign-in" />}
							/>
							<Route
								path="sign-up/*"
								element={<SignUp routing="path" path="/sign-up" />}
							/>

							{/* Protected Routes */}
							<Route path="/" element={<ProtectedRoute />}>
								<Route path="dashboard" element={<Dashboard />} />
								<Route path="create-family" element={<CreateFamily />} />
								<Route
									path="edit-address/:personId"
									element={<EditAddress />}
								/>
							</Route>

							{/* Catch-all Route */}
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</ClerkProvider>
		</AppErrorBoundary>
	</StrictMode>
);
