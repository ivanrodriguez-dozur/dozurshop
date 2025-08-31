import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type BoomUI = {
  id: string;
  video: string;
  cover?: string | null;
  title: string;
  user?: string | null;
  likes: number;
  saves?: number;
  views?: number;
  shares?: number;
  comments?: number;
  created_at: string;
};

type LikeState = "on" | "off";     // claro y extensible (ej. "pending")
type SaveState = "on" | "off";

interface BoomStore {
  // Data
  booms: Record<string, BoomUI>;   // por id
  order: string[];                 // orden visible (paginación)
  liked: Map<string, LikeState>;   // estados por id
  saved: Map<string, SaveState>;

  // Feed control
  visibleIndex: number;
  mountedRange: [number, number];  // windowing: [from, to]
  cursor: string | null;
  hasMore: boolean;
  isFetching: boolean;

  // Helpers
  hasId: (id: string) => boolean;
  getByIndex: (i: number) => BoomUI | undefined;

  // Actions
  setBooms: (rows: BoomUI[]) => void;
  addBooms: (rows: BoomUI[]) => void;
  updateBoom: (id: string, patch: Partial<BoomUI>) => void;

  setVisibleIndex: (i: number) => void;
  setMountedRange: (from: number, to: number) => void;

  setCursor: (c: string | null) => void;
  setHasMore: (v: boolean) => void;
  setIsFetching: (v: boolean) => void;

  // Optimistic actions (solo UI; afuera llamas a Supabase)
  likeOptimistic: (id: string) => void;
  unlikeOptimistic: (id: string) => void;
  saveOptimistic: (id: string) => void;
  unsaveOptimistic: (id: string) => void;

  // Rollback si falla la API
  rollbackLike: (id: string, prev: LikeState) => void;
  rollbackSave: (id: string, prev: SaveState) => void;
}

export const useBoomStore = create<BoomStore>()(
  subscribeWithSelector((set, get) => ({
    booms: {},
    order: [],
    liked: new Map(),
    saved: new Map(),

    visibleIndex: 0,
    mountedRange: [0, 0],
    cursor: null,
    hasMore: true,
    isFetching: false,

    hasId: (id) => !!get().booms[id],
    getByIndex: (i) => {
      const id = get().order[i];
      return id ? get().booms[id] : undefined;
    },

    setBooms: (rows) =>
      set(() => {
        const booms: Record<string, BoomUI> = {};
        const order: string[] = [];
        rows.forEach((r) => {
          if (!booms[r.id]) {
            booms[r.id] = r;
            order.push(r.id);
          }
        });
        return { booms, order, liked: new Map(), saved: new Map() };
      }),

    addBooms: (rows) =>
      set((state) => {
        const booms = { ...state.booms };
        const order = [...state.order];
        for (const r of rows) {
          if (!booms[r.id]) {
            booms[r.id] = r;
            order.push(r.id);
          } else {
            // si ya existe, opcional: refrescar campos
            booms[r.id] = { ...booms[r.id], ...r };
          }
        }
        return { booms, order };
      }),

    updateBoom: (id, patch) =>
      set((state) => ({
        booms: { ...state.booms, [id]: { ...state.booms[id], ...patch } },
      })),

    setVisibleIndex: (i) => set({ visibleIndex: i }),
    setMountedRange: (from, to) => set({ mountedRange: [from, to] }),

    setCursor: (cursor) => set({ cursor }),
    setHasMore: (hasMore) => set({ hasMore }),
    setIsFetching: (isFetching) => set({ isFetching }),

    likeOptimistic: (id) =>
      set((state) => {
        const prev = state.liked.get(id) ?? "off";
        if (prev === "on") return state;
        const liked = new Map(state.liked);
        liked.set(id, "on");
        const booms = {
          ...state.booms,
          [id]: { ...state.booms[id], likes: (state.booms[id]?.likes ?? 0) + 1 },
        };
        return { liked, booms };
      }),

    unlikeOptimistic: (id) =>
      set((state) => {
        const prev = state.liked.get(id) ?? "off";
        if (prev === "off") return state;
        const liked = new Map(state.liked);
        liked.set(id, "off");
        const booms = {
          ...state.booms,
          [id]: {
            ...state.booms[id],
            likes: Math.max(0, (state.booms[id]?.likes ?? 0) - 1),
          },
        };
        return { liked, booms };
      }),

    saveOptimistic: (id) =>
      set((state) => {
        const saved = new Map(state.saved);
        saved.set(id, "on");
        return { saved };
      }),

    unsaveOptimistic: (id) =>
      set((state) => {
        const saved = new Map(state.saved);
        saved.set(id, "off");
        return { saved };
      }),

    rollbackLike: (id, prev) =>
      set((state) => {
        const liked = new Map(state.liked);
        liked.set(id, prev);
        return { liked };
      }),

    rollbackSave: (id, prev) =>
      set((state) => {
        const saved = new Map(state.saved);
        saved.set(id, prev);
        return { saved };
      }),
  }))
);