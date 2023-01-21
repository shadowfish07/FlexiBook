import create from "zustand";

type SelectedType = "categories";

type SideMenuState = {
  selectedId: string;
  selectedType: SelectedType;
  setSelect: (key: string) => void;
};

export const useSideMenuState = create<SideMenuState>((set) => ({
  selectedId: "default",
  selectedType: "categories",
  setSelect: (key: string) => {
    set({
      selectedId: key.split("-")[1],
      selectedType: key.split("-")[0] as SelectedType,
    });
  },
}));
