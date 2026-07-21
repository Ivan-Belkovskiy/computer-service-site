'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { uploadFile } from '@/app/actions/upload';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = 'Изображение' }: ImageUploaderProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    startTransition(async () => {
      const result = await uploadFile(formData);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setError(result.error || 'Ошибка при загрузке');
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {value && (
        <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <Image
            src={value}
            alt="Preview Image"
            fill
            className="object-contain p-2"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
            title="Удалить"
          >
            ×
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isPending}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer"
      />

      {isPending && <p className="text-xs text-blue-600 font-medium">Загрузка файла на сервер...</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}