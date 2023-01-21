import create from "zustand";

type BookmarkLoadState = {
  loadingBookmarks: Set<string>;
  addLoadingBookmarks: (id: string) => void;
  removeLoadingBookmarks: (id: string) => void;
};

export const useBookmarkLoadState = create<BookmarkLoadState>((set) => ({
  loadingBookmarks: new Set<string>(),
  addLoadingBookmarks: (id: string) => {
    set((state) => {
      state.loadingBookmarks.add(id);
      return { loadingBookmarks: new Set<string>(state.loadingBookmarks) };
    });
  },
  removeLoadingBookmarks: (id: string) => {
    set((state) => {
      state.loadingBookmarks.delete(id);
      return { loadingBookmarks: new Set<string>(state.loadingBookmarks) };
    });
  },
}));
