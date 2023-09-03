import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import PasswordBreachLogo from "../assets/spy.png";
import MFAlogo from "../assets/2fa.png";
import RubberDuck from "../assets/rubber-duck.png";

export default function Features() {
	const [tab, setTab] = useState<number>(1);

	const tabs = useRef<HTMLDivElement>(null);

	const heightFix = () => {
		if (tabs.current && tabs.current.parentElement)
			tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`;
	};

	useEffect(() => {
		heightFix();
	}, []);

	return (
		<section className="relative">
			{/* Section background (needs .relative class on parent and next sibling elements) */}
			<div
				className="absolute inset-0 bg-gray-100 pointer-events-none mb-16"
				aria-hidden="true"
			></div>
			<div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>

			<div className="relative max-w-6xl mx-auto px-4 sm:px-6">
				<div className="pt-12 md:pt-20">
					{/* Section header */}
					<div className="max-w-4xl mx-auto text-center pb-12 md:pb-16">
						<h1 className="h2 mb-4">About Us</h1>
						<p className="text-xl text-gray-600 p-2">
							<span className="font-bold">
								Your Quacktastic Key to Rock-Solid Online
								Security!
							</span>{" "}
							DuckPass revolutionizes your online security
							experience by effortlessly managing your passwords
							and safeguarding your digital life. Say goodbye to
							weak and easily cracked passwords – with DuckPass,
							you're in control.
						</p>
						<p className="text-3xl font-bold">•</p>
						<p className="text-xl text-gray-600 p-2">
							<span className="font-bold">
								Secure and Simplified
							</span>
							: DuckPass ensures your passwords are unbreakable
							while providing a seamless user experience. No more
							struggling to remember multiple passwords or using
							weak ones.
						</p>
						<p className="text-3xl font-bold">•</p>
						<p className="text-xl text-gray-600 p-2">
							<span className="font-bold">
								Quack Your Way to Safety
							</span>
							: Just like a duck's watertight feathers, DuckPass
							creates a protective shield around your accounts.
							Trust in our advanced encryption to keep your data
							safe.
						</p>
						<p className="text-3xl font-bold">•</p>
						<p className="text-xl text-gray-600 p-2">
							<span className="font-bold">
								Stay Ahead of Breaches
							</span>
							: Stay informed about potential vulnerabilities with
							DuckPass. We regularly monitor new breaches to check
							if your informations could be in it.
						</p>
					</div>

					{/* Section content */}
					<div className="md:grid md:grid-cols-12 md:gap-6">
						{/* Content */}
						<div
							className="text-center md:text-left max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6"
							data-aos="fade-right"
						>
							<div className="md:pr-4 lg:pr-12 xl:pr-16 mb-8">
								<h3 className="h3 mb-3">Powerful features</h3>
								<p className="text-xl text-gray-600">
									Manage and secure your passwords all in one
									place. Simply store your passwords in
									DuckPass and access them whenever you need,
									but not only !
								</p>
							</div>
							{/* Tabs buttons */}
							<div className="mb-8 md:mb-0">
								<a
									className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
										tab !== 1
											? "bg-white shadow-md border-gray-200 hover:shadow-lg"
											: "bg-gray-200 border-transparent"
									}`}
									href="#0"
									onClick={e => {
										e.preventDefault();
										setTab(1);
									}}
								>
									<div>
										<div className="font-bold leading-snug tracking-tight mb-1">
											Password breaches
										</div>
										<div className="text-gray-600">
											Check if your passwords have been
											exposed by a simple click.
										</div>
									</div>
									<div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="1em"
											viewBox="0 0 448 512"
										>
											<path d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
										</svg>
									</div>
								</a>
								<a
									className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
										tab !== 2
											? "bg-white shadow-md border-gray-200 hover:shadow-lg"
											: "bg-gray-200 border-transparent"
									}`}
									href="#0"
									onClick={e => {
										e.preventDefault();
										setTab(2);
									}}
								>
									<div>
										<div className="font-bold leading-snug tracking-tight mb-1">
											2FA Manager
										</div>
										<div className="text-gray-600">
											Easily organize and control your
											two-factor authentication methods.
											Use it as an authentication app to
											generate the time based codes.
										</div>
									</div>
									<div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="1em"
											viewBox="0 0 512 512"
										>
											<path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z" />
										</svg>
									</div>
								</a>
								<a
									className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${
										tab !== 3
											? "bg-white shadow-md border-gray-200 hover:shadow-lg"
											: "bg-gray-200 border-transparent"
									}`}
									href="#0"
									onClick={e => {
										e.preventDefault();
										setTab(3);
									}}
								>
									<div>
										<div className="font-bold leading-snug tracking-tight mb-1">
											Simplicity
										</div>
										<div className="text-gray-600">
											Don't blow your mind and embrace
											this ducky simplicity!
										</div>
									</div>
									<div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="1em"
											viewBox="0 0 576 512"
										>
											<path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z" />
										</svg>
									</div>
								</a>
							</div>
						</div>

						{/* Tabs items */}
						<div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1">
							<div className="transition-all">
								<div
									className="relative flex flex-col text-center lg:text-right"
									ref={tabs}
								>
									{/* Item 1 */}
									<Transition
										show={tab === 1}
										appear={true}
										className="w-full"
										enter="transition ease-in-out duration-700 transform order-first"
										enterFrom="opacity-0 translate-y-16"
										enterTo="opacity-100 translate-y-0"
										leave="transition ease-in-out duration-300 transform absolute"
										leaveFrom="opacity-100 translate-y-0"
										leaveTo="opacity-0 -translate-y-16"
										beforeEnter={() => heightFix()}
										unmount={false}
									>
										<div className="relative inline-flex flex-col">
											<img
												className="w-2/3 mx-auto rounded"
												src={PasswordBreachLogo}
												width={512}
												height="362"
												alt="Shield logo"
											/>
										</div>
									</Transition>
									{/* Item 2 */}
									<Transition
										show={tab === 2}
										appear={true}
										className="w-full"
										enter="transition ease-in-out duration-700 transform order-first"
										enterFrom="opacity-0 translate-y-16"
										enterTo="opacity-100 translate-y-0"
										leave="transition ease-in-out duration-300 transform absolute"
										leaveFrom="opacity-100 translate-y-0"
										leaveTo="opacity-0 -translate-y-16"
										beforeEnter={() => heightFix()}
										unmount={false}
									>
										<div className="relative inline-flex flex-col">
											<img
												className="w-2/3 mx-auto rounded"
												src={MFAlogo}
												width={500}
												height="462"
												alt="MFA image"
											/>
										</div>
									</Transition>
									{/* Item 3 */}
									<Transition
										show={tab === 3}
										appear={true}
										className="w-full"
										enter="transition ease-in-out duration-700 transform order-first"
										enterFrom="opacity-0 translate-y-16"
										enterTo="opacity-100 translate-y-0"
										leave="transition ease-in-out duration-300 transform absolute"
										leaveFrom="opacity-100 translate-y-0"
										leaveTo="opacity-0 -translate-y-16"
										beforeEnter={() => heightFix()}
										unmount={false}
									>
										<div className="relative inline-flex flex-col">
											<img
												className="w-2/3 mx-auto rounded"
												src={RubberDuck}
												width={512}
												height="362"
												alt="Shield logo"
											/>
										</div>
									</Transition>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
