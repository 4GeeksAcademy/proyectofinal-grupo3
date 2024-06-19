import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { HeroSection } from "../component/hero";
import { HeroSection_2 } from "../component/hero2";
import { BenefitsOverview } from "../component/benefitsOverview";
import { ScientificArticleCard } from "../component/scientificArticleCard";


export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5 px-3">
			
			<HeroSection />
			<HeroSection_2 />
			<BenefitsOverview /> 
			<ScientificArticleCard />
			

		
		</div>
	);
};
