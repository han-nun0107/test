import { useState, useCallback, useEffect } from "react";
import type { FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { supabase } from "@/supabase/supabase";
import { convertYoutubeToThumbnail } from "@/utils";
import type { FormData } from "@/types/admin/editSong";
import { INITIAL_FORM_DATA } from "@/constants/admin/editSong";
import { useEditSongStore } from "@/stores/editSongStore";

export const useEditSong = () => {
  const queryClient = useQueryClient();
  const { songToEdit, clearSongToEdit } = useEditSongStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    if (songToEdit) {
      const artist =
        (songToEdit.artist as string) || (songToEdit.singer as string) || "";

      let categories = "";
      if (songToEdit.categories) {
        if (Array.isArray(songToEdit.categories)) {
          categories = songToEdit.categories
            .filter((cat): cat is string => typeof cat === "string")
            .join(", ");
        } else if (typeof songToEdit.categories === "string") {
          try {
            const parsed = JSON.parse(songToEdit.categories);
            if (Array.isArray(parsed)) {
              categories = parsed
                .filter((cat): cat is string => typeof cat === "string")
                .join(", ");
            } else {
              categories = songToEdit.categories;
            }
          } catch {
            categories = songToEdit.categories;
          }
        }
      } else if (songToEdit.category) {
        if (Array.isArray(songToEdit.category)) {
          categories = songToEdit.category
            .filter((cat): cat is string => typeof cat === "string")
            .join(", ");
        } else if (typeof songToEdit.category === "string") {
          try {
            const parsed = JSON.parse(songToEdit.category);
            if (Array.isArray(parsed)) {
              categories = parsed
                .filter((cat): cat is string => typeof cat === "string")
                .join(", ");
            } else {
              categories = songToEdit.category;
            }
          } catch {
            categories = songToEdit.category;
          }
        }
      }

      setFormData({
        title: (songToEdit.title as string) || "",
        artist,
        categories,
        key: songToEdit.key || "",
        notes: (songToEdit.notes as string) || "",
        completed: songToEdit.completed || false,
        recommend: songToEdit.recommend || false,
        bomb: songToEdit.bomb || false,
        inst: (songToEdit.inst as string) || "",
        thumbnail_url: songToEdit.thumbnail_url || "",
      });
      setEditingId(songToEdit.id || null);
    }
  }, [songToEdit]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : type === "number"
              ? parseInt(value) || 0
              : value,
      }));
    },
    [],
  );

  const preparePayload = useCallback((data: FormData) => {
    let categoriesValue: string;
    if (typeof data.categories === "string" && data.categories.trim()) {
      const categoriesArray = data.categories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);
      categoriesValue = JSON.stringify(categoriesArray);
    } else if (Array.isArray(data.categories)) {
      categoriesValue = JSON.stringify(data.categories);
    } else {
      categoriesValue = data.categories;
    }

    return {
      title: data.title.trim(),
      artist: data.artist.trim(),
      categories: categoriesValue,
      key: data.key.trim(),
      transpose: 0,
      notes: data.notes.trim(),
      completed: data.completed,
      recommend: data.recommend,
      bomb: data.bomb,
      inst: data.inst.trim(),
      thumbnail_url:
        data.thumbnail_url.trim() ||
        convertYoutubeToThumbnail(data.inst.trim()),
    };
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setEditingId(null);
    clearSongToEdit();
  }, [clearSongToEdit]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      const payload = preparePayload(formData);

      try {
        let error = null;
        let result = null;

        if (editingId) {
          const updatePayload = { ...payload, id: editingId };
          const response = await supabase
            .from("onusongdb")
            .upsert([updatePayload] as never, { onConflict: "id" });
          error = response.error;
          result = response.data;
        } else {
          const response = await supabase
            .from("onusongdb")
            .insert([payload] as never);
          error = response.error;
          result = response.data;
        }

        if (error) {
          toast.error(error.message || "오류가 발생했습니다.");
        } else {
          toast.success(
            editingId ? "노래가 수정되었습니다." : "노래가 추가되었습니다.",
          );
          queryClient.invalidateQueries({ queryKey: ["songs"] });
          resetForm();
        }
      } catch (error) {
        toast.error("알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, editingId, preparePayload, queryClient, resetForm],
  );

  const deleteSong = useCallback(
    async (songId: number) => {
      if (!confirm("정말로 이 노래를 삭제하시겠습니까?")) {
        return;
      }

      try {
        const { error } = await supabase
          .from("onusongdb")
          .delete()
          .eq("id", songId);

        if (error) {
          toast.error(error.message || "삭제 중 오류가 발생했습니다.");
        } else {
          toast.success("노래가 삭제되었습니다.");
          queryClient.invalidateQueries({ queryKey: ["songs"] });
        }
      } catch (error) {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    },
    [queryClient],
  );

  return {
    formData,
    editingId,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
    setEditingId,
    deleteSong,
  };
};
