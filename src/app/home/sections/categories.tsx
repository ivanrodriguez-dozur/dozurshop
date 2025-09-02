import React from "react";
import { estilosEtiquetas, etiquetas } from "../etiquetas";

export default function Categories({
  activeCategory,
  setActiveCategory,
  gridRef,
}: {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  gridRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      className="w-full overflow-x-auto scrollbar-hide"
      style={{ WebkitOverflowScrolling: 'touch', paddingLeft: 18, marginBottom: 8 }}
    >
      <div className="flex flex-nowrap py-2" style={{ gap: 24 }}>
        {etiquetas.map(({ icon, categoria, descripcion }) => {
          const isActive = activeCategory === categoria;
          return (
            <button
              key={categoria}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] p-0 rounded-full ${
                isActive
                  ? `${estilosEtiquetas.colores.activo.bg} ${estilosEtiquetas.colores.activo.text} ${estilosEtiquetas.colores.activo.border} scale-105`
                  : `${estilosEtiquetas.colores.inactivo.bg} ${estilosEtiquetas.colores.inactivo.text} ${estilosEtiquetas.colores.inactivo.border}`
              } shadow ${estilosEtiquetas.colores.hover} transition-transform duration-200 transform hover:scale-110 focus:outline-none`}
              onClick={() => {
                if (!isActive) {
                  if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
                    window.navigator.vibrate(30);
                  }
                  setActiveCategory(categoria);
                  setTimeout(() => {
                    if (gridRef.current) {
                      gridRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }
                  }, 80);
                }
              }}
              title={descripcion}
              style={{ flex: '0 0 auto' }}
            >
              <span
                className={`${isActive ? estilosEtiquetas.icono.activo : estilosEtiquetas.icono.inactivo} mb-1`}
              >
                {icon && typeof icon === 'function' ? React.createElement(icon) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}