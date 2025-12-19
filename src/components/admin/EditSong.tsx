import { useMemo, useCallback } from "react";
import { useEditSong } from "@/hooks";
import {
  FORM_FIELDS,
  CHECKBOX_FIELDS,
  INPUT_CLASSES,
  CHECKBOX_CLASSES,
} from "@/constants/admin/editSong";
import type { FormField, CheckboxField } from "@/types/admin/editSong";
import { AdminGuard, Button } from "@/components";

export default function EditSong() {
  const {
    formData,
    editingId,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useEditSong();

  const renderFormField = useCallback(
    (field: FormField) => {
      const isTextarea = field.type === "textarea";
      const isNumber = field.type === "number";
      const spanClass = field.span === "full" ? "md:col-span-2" : "";

      return (
        <div key={field.id} className={spanClass}>
          <label
            htmlFor={field.id}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </label>
          {isTextarea ? (
            <textarea
              id={field.id}
              name={field.id}
              value={formData[field.id] as string}
              onChange={handleInputChange}
              rows={4}
              className={INPUT_CLASSES}
              placeholder={field.placeholder}
            />
          ) : (
            <input
              type={field.type}
              id={field.id}
              name={field.id}
              value={
                isNumber
                  ? (formData[field.id] as number) || 0
                  : (formData[field.id] as string)
              }
              onChange={handleInputChange}
              required={field.required}
              className={INPUT_CLASSES}
              placeholder={field.placeholder}
              min={isNumber ? -12 : undefined}
              max={isNumber ? 12 : undefined}
            />
          )}
        </div>
      );
    },
    [formData, handleInputChange],
  );

  const renderCheckbox = useCallback(
    (field: CheckboxField) => (
      <label key={field.id} className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          name={field.id}
          checked={formData[field.id] as boolean}
          onChange={handleInputChange}
          className={CHECKBOX_CLASSES}
        />
        <span className="text-sm font-medium text-gray-700">{field.label}</span>
      </label>
    ),
    [formData, handleInputChange],
  );

  const submitButtonText = useMemo(() => {
    if (isSubmitting) return "처리 중...";
    return editingId ? "✨ 수정하기" : "✨ 추가하기";
  }, [isSubmitting, editingId]);

  return (
    <AdminGuard>
      <div id="edit-song-section" className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {editingId ? "노래 수정" : "노래 추가"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            노래 정보를 입력하고 저장하세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {FORM_FIELDS.map(renderFormField)}
          </div>

          <div className="flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            {CHECKBOX_FIELDS.map(renderCheckbox)}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="SUBMIT_BUTTON"
            >
              {submitButtonText}
            </Button>
            {editingId && (
              <Button type="button" onClick={resetForm} variant="CANCEL_BUTTON">
                취소
              </Button>
            )}
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
