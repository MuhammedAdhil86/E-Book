// store/useBookmarkStore.js
import { create } from "zustand";
import Cookies from "js-cookie";
import api from "../api/Instance";

export const useBookmarkStore = create((set, get) => ({
  bookmarks: [],
  bookmarksLoading: false,
  bookmarksError: null,

  getUserId: () => {
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    return user?.id || user?.user_id || null;
  },

  fetchBookmarks: async () => {
    const userId = get().getUserId();
    if (!userId) {
      set({ bookmarksError: "User not authenticated" });
      return;
    }
    set({ bookmarksLoading: true, bookmarksError: null });

    try {
      const res = await api.get(`/user/bookmarks/${userId}`);
      set({ bookmarks: res.data.bookmarks || [] });
    } catch (err) {
      set({
        bookmarksError:
          err.response?.data?.message || "Failed to load bookmarks",
      });
    } finally {
      set({ bookmarksLoading: false });
    }
  },

  /**
   * Add a bookmark by fetching child.id from /ebook-content/:id
   * `contentId` = ID you pass from your ebook (usually cover_id or similar)
   */
  addBookmarkFromContent: async (contentId) => {
    const userId = get().getUserId();
    if (!userId) {
      set({ bookmarksError: "User not authenticated" });
      return;
    }

    try {
      // 1. Fetch ebook content
      const contentRes = await api.get(`/ebook-content/${contentId}`);
      const contentData = contentRes.data;

      if (!contentData?.children?.length) {
        set({ bookmarksError: "No sections found to bookmark" });
        return;
      }

      // 2. Use first child.id as book_id (or adjust if you want specific section)
      const childId = contentData.children[0].id;

      // 3. Create bookmark
      await api.post(`/user/bookmark/create`, {
        user_id: userId,
        book_id: childId,      // ✅ Required by backend
        info_id: contentData.id // Optional: to keep reference to parent
      });

      // 4. Refresh bookmarks list
      await get().fetchBookmarks();
    } catch (err) {
      set({
        bookmarksError:
          err.response?.data?.message || "Failed to add bookmark",
      });
    }
  },

  removeBookmark: async (bookmarkId) => {
    try {
      await api.delete(`/user/bookmarks/${bookmarkId}`);
      set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
      }));
    } catch (err) {
      set({
        bookmarksError:
          err.response?.data?.message || "Failed to remove bookmark",
      });
    }
  },
}));
