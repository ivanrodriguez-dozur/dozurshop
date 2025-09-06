"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

import VideosView from "./components/VideosView";
import BoomsView from "./components/BoomsView";

interface ContentItem {
  id: string;
  type: "videos" | "booms" | "fotos";
  url: string;
  title: string;
  description?: string;
  author: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    plays?: number;
    isLiked?: boolean;
    isSaved?: boolean;
  };
}

export default function BoomsPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'booms' | 'fotos'>('videos');

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);

        // 1️⃣ Booms → consulta directa Supabase
        const { data: boomsData, error: boomsError } = await supabase
          .from("booms")
          .select("id, video_url, original_url, title")
          .order("id", { ascending: false });
        if (boomsError) console.error("❌ Error booms:", boomsError);

        // 2️⃣ Videos largos
        const { data: videosData, error: videosError } = await supabase
          .from("fulltime")
          .select("*")
          .limit(10);
        if (videosError) console.error("❌ Error videos:", videosError);

        // 3️⃣ Fotos
        const { data: photosData, error: photosError } = await supabase
          .from("gallery")
          .select("*")
          .limit(10);
        if (photosError) console.error("❌ Error fotos:", photosError);

        const allContent: ContentItem[] = [];

        // Mapear Booms (solo si tienen video_url válida)
        if (boomsData && Array.isArray(boomsData)) {
          const mappedBooms = boomsData
            .filter((boom: any) => !!boom.video_url)
            .map((boom: any) => ({
              id: boom.id,
              type: "booms" as const,
              url: boom.video_url,
              title: boom.title || "Boom sin título",
              author: "@usuario",
              stats: {
                likes: 0,
                comments: 0,
                shares: 0,
              },
            }));
          console.log("Booms mapeados:", mappedBooms);
          allContent.push(...mappedBooms);
        }

        // Mapear Videos largos (solo si tienen video_url válida)
        if (videosData) {
          const mappedVideos = videosData
            .filter((video: any) => !!video.video_url)
            .map((video: any) => ({
              id: video.id,
              type: "videos" as const,
              url: video.video_url,
              title: video.title || "Video sin título",
              author: "@usuario",
              stats: {
                likes: 0,
                comments: 0,
                shares: 0,
              },
            }));
          console.log("Videos mapeados:", mappedVideos);
          allContent.push(...mappedVideos);
        }

        // Mapear Fotos
        if (photosData) {
          allContent.push(
            ...photosData.map((foto: any) => ({
              id: foto.id,
              type: "fotos" as const,
              url: foto.image_url,
              title: foto.title || "Foto sin título",
              author: "@usuario",
              stats: {
                likes: foto.likes_count ?? 0,
                comments: foto.comments_count ?? 0,
                shares: foto.shares_count ?? 0,
              },
            }))
          );
        }

        setContent(allContent);
      } catch (error) {
        console.error("❌ Error:", error);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando contenido...</div>
      </div>
    );
  }

  if (!loading && content.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        No hay contenido disponible.
      </div>
    );
  }

  // ...existing code...

  const videosContent = content.filter((i) => i.type === 'videos');
  const boomsContent = content.filter((i) => i.type === 'booms');
  const photosContent = content.filter((i) => i.type === 'fotos');

  return (
  <div className="h-screen w-full bg-black relative">
      {/* Selector superior */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center space-x-6 p-3 bg-gradient-to-b from-black/40 to-transparent">
        {['videos', 'booms', 'fotos'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'videos' | 'booms' | 'fotos')}
            className={`text-base font-semibold ${
              activeTab === tab
                ? 'text-white border-b-2 border-white'
                : 'text-white/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Renderizado de la vista activa */}
      <div className="w-full h-full flex items-center justify-center">
        {activeTab === 'videos' && (
          videosContent.length > 0 ? (
            <VideosView videos={videosContent.map(v => ({
              id: v.id,
              url: v.url,
              title: v.title,
              description: v.description ?? '',
              author: v.author ?? '@usuario',
            }))} />
          ) : (
            <div className="text-white">No hay videos disponibles.</div>
          )
        )}
        {activeTab === 'booms' && (
          boomsContent.length > 0 ? (
            <BoomsView />
          ) : (
            <div className="text-white">No hay booms disponibles.</div>
          )
        )}
        {activeTab === 'fotos' && (
          photosContent.length > 0 ? (
            <div className="text-white">Aquí iría la vista de fotos.</div>
          ) : (
            <div className="text-white">No hay fotos disponibles.</div>
          )
        )}
      </div>
    </div>
  );
}
