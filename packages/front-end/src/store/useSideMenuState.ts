import create from "zustand";

type SelectedType = "categories" | "tags" | "sharedContents";

type SideMenuState = {
  selectedId: string;
  selectedType: SelectedType;
  setSelect: (key: string) => void;
};

export const useSideMenuState = create<SideMenuState>((set) => ({
  selectedId: "default",
  selectedType: "categories",
  setSelect: (key: string) => {
    // 解析格式 selectedType-selectedId（id可能会有-）
    const [, selectedType, selectedId] = /([^-]*)-(.*)/g.exec(key) || [];
    if (!selectedType || !selectedId) {
      console.warn("side menu key is wrong:", key);
      return;
    }
    set({
      selectedId,
      selectedType: selectedType as SelectedType,
    });
  },
}));
