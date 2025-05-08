import { Outlet, Link, useLocation } from 'react-router';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

export default function AppLayout() {
	const currentPath = useLocation().pathname;
	const publicNavLinks = [
		{ path: '/', label: 'Home' },
		{ path: '/sign-in', label: 'Sign In' },
		{ path: '/sign-up', label: 'Sign Up' }
	];
	const privateNavLinks = [
		{ path: '/', label: 'Home' },
		{ path: '/dashboard', label: 'Dashboard' },
		{ path: '/create-family', label: 'Create Family' }
	];
	return (
		<div className="app-layout">
			<header className="flex justify-between p-4 bg-gray-100">
				<h1 className="text-xl font-bold">Carpool Manager</h1>
				<nav className="space-x-4">
					<SignedOut>
						{publicNavLinks.map(
							({ path, label }) =>
								currentPath !== path && (
									<Link key={path} to={path} className="hover:underline">
										{label}
									</Link>
								)
						)}
					</SignedOut>
					<SignedIn>
						{privateNavLinks.map(
							({ path, label }) =>
								currentPath !== path && (
									<Link key={path} to={path} className="hover:underline">
										{label}
									</Link>
								)
						)}
						<UserButton />
					</SignedIn>
				</nav>
			</header>
			<main className="p-4">
				<Outlet />
			</main>
		</div>
	);
}
