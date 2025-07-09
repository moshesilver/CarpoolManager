import { useNavigate } from 'react-router-dom';

export default function Home() {
	const navigate = useNavigate();

	return (
		<div>
			<h1 className="text-6xl py-2">Welcome to Carpool Manager</h1>
			<p>Please sign in or sign up to get started.</p>
			<button
				onClick={() => {
					navigate('/create-family');
				}}
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mt-4"
			>
				Create Family
			</button>
		</div>
	);
}
