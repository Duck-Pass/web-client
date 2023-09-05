import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import PasswordBreachLogo from "../assets/spy.png";
import MFAlogo from "../assets/2fa.png";
import RubberDuck from "../assets/rubber-duck.png";

export default function Features() {
	const [tab, setTab] = useState<number>(1);

	const tabs = useRef<HTMLDivElement>(null);

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
											Zero-knowledge
										</div>
										<div className="text-gray-600">
											Explore our revolutionary
											'zero-knowledge' feature that
											ensures absolute security, allowing
											your data to remain confidential
											even if our database is exposed,
											without ever revealing any passwords
											or email in your vault.
										</div>
									</div>
									<div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="1em"
											viewBox="0 0 576 512"
										>
											<path d="M288 64C64 64 0 160 0 272S80 448 176 448h8.4c24.2 0 46.4-13.7 57.2-35.4l23.2-46.3c4.4-8.8 13.3-14.3 23.2-14.3s18.8 5.5 23.2 14.3l23.2 46.3c10.8 21.7 33 35.4 57.2 35.4H400c96 0 176-64 176-176s-64-208-288-208zM96 256a64 64 0 1 1 128 0A64 64 0 1 1 96 256zm320-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
										</svg>
									</div>
								</a>
							</div>
						</div>

						{/* Tabs items */}
						<div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1">
							<div className="transition-all h-auto">
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
										unmount={false}
									>
										<div className="relative inline-flex flex-col">
											<img
												className="w-2/3 mx-auto rounded"
												src={PasswordBreachLogo}
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
										unmount={false}
									>
										<div className="relative inline-flex flex-col">
											<img
												className="w-2/3 mx-auto rounded"
												src={MFAlogo}
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
										unmount={false}
									>
										<div className="relative inline-flex flex-col">
											<img
												className="w-2/3 mx-auto rounded"
												src={RubberDuck}
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
