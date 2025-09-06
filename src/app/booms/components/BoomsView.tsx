

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TikTokFeed from "../TikTokFeed";
import { useBottomDock } from "@/app/context/BottomDockContext";

interface BoomContent {
	id: string;
	title: string;
	url: string;
	author?: string;
	stats: {
		likes?: number;
		comments?: number;
		shares?: number;
		plays?: number;
	};
}

export default function BoomsView() {
	const [boomsContent, setBoomsContent] = useState<BoomContent[]>([]);
	const [loading, setLoading] = useState(true);
	const { setIsVisible } = useBottomDock();

	const handleProductBannerToggle = (isVisible: boolean) => {
		setIsVisible(!isVisible); // Cuando el banner está visible, ocultar el dock
	};

	useEffect(() => {
		async function fetchBooms() {
			setLoading(true);
			const { data, error } = await supabase
				.from("booms")
				.select("id, video_url, title")
				.order("id", { ascending: false });
			if (!error && data) {
								const mapped = data.map((boom: any) => ({
									id: boom.id.toString(),
									title: boom.title || "Boom sin título",
									url: boom.video_url,
									author: "@usuario",
									stats: {
										likes: 0,
										comments: 0,
										shares: 0,
										plays: 0,
									},
								}));
								console.log("Booms mapeados:", mapped);
								setBoomsContent(mapped);
			}
			setLoading(false);
		}
		fetchBooms();
	}, []);

	if (loading) {
		return (
			<div className="h-screen bg-black flex items-center justify-center">
				<div className="text-white">Cargando contenido...</div>
			</div>
		);
	}

	if (!loading && boomsContent.length === 0) {
		return (
			<div className="h-screen bg-black flex items-center justify-center text-white">
				No hay contenido disponible.
			</div>
		);
	}

	return (
		<TikTokFeed
			videosContent={[]}
			boomsContent={boomsContent}
			photosContent={[]}
			onProductBannerToggle={handleProductBannerToggle}
		/>
	);
}
