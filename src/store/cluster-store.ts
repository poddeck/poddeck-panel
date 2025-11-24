import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ClusterStore = {
  clusterId?: string;

  actions: {
    setClusterId: (id: string) => void;
    clearClusterId: () => void;
  };
};

const useClusterStore = create<ClusterStore>()(
  persist(
    (set) => ({
      clusterId: undefined,
      actions: {
        setClusterId: (id: string) => set({ clusterId: id }),
        clearClusterId: () => set({ clusterId: undefined }),
      },
    }),
    {
      name: "cluster",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ clusterId: state.clusterId }),
    }
  )
);

export const useClusterId = () => useClusterStore((state) => state.clusterId);
export const useClusterActions = () => useClusterStore((state) => state.actions);

export default useClusterStore;
