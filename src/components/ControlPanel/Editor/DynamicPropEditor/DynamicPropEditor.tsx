'use client';

import { PropSchemaField } from '@/types/sections';
import { ImageUploader } from '@/components/ControlPanel/ImageUploader/ImageUploader';

interface DynamicPropEditorProps {
  fields: PropSchemaField[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export function DynamicPropEditor({ fields, values, onChange }: DynamicPropEditorProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const currentValue = values[field.key] ?? field.defaultValue ?? '';

        switch (field.type) {
          case 'image':
            return (
              <ImageUploader
                key={field.key}
                label={field.label}
                value={currentValue}
                onChange={(url) => onChange(field.key, url)}
              />
            );

          case 'textarea':
            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <textarea
                  value={currentValue}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            );

          case 'boolean':
            return (
              <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(currentValue)}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">{field.label}</span>
              </label>
            );

          case 'number':
            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => onChange(field.key, Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            );

          case 'text':
          default:
            return (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            );
        }
      })}
    </div>
  );
}