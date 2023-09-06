import Hero from "@/components/hero";
import Header from "@/components/ui/header";
import FeaturesBlocks from "@/components/features-blocks";
import Features from "@/components/features";
import Footer from "@/components/ui/footer";

export default function Home() {
	// document.body.style.backgroundColor = "#022837";

	return (
		<>
			<Header />
			<main className="grow">
				<Hero />
				<Features />
				<FeaturesBlocks />
			</main>
			<Footer />
		</>
	);
}
