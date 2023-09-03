import { Link } from "react-router-dom";
import Logo from "@/assets/ducky-round.png";

export default function Page404() {
	return (
		<>
			<div className="h-screen flex flex-col items-center bg-[#022837] justify-center bg-">
				<p className="text-white text-5xl font-['Pattaya']">Quack!</p>
				<div className="flex flex-col md:flex-row items-center">
					<Link to="/">
						<img className="w-64 h-64 p-2 mb-2" src={Logo} alt="" />
					</Link>
					<p className="w-64 text-4xl text-center text-white font-['Pattaya']">
						404 not found
					</p>
				</div>
				<p className="w-64 text-center text-white text-3xl font-['Pattaya']">
					Hey Ducky, you are looking for the wrong page. Click on me
					to find your way!
				</p>
			</div>
		</>
	);
}
