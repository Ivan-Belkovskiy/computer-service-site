'use server';

import { mkdirSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';


export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File | null;

  if (!file || file.size === 0) {
    return { success: false, error: 'Файл не выбран' };
  }

  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Разрешено загружать только изображения' };
  }

  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'Размер файла не должен превышать 5 МБ' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = path.extname(file.name) || '.webp';
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExtension}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFileName);
    writeFileSync(filePath, buffer);

    return {
      success: true,
      url: `/uploads/${uniqueFileName}`,
    };
  } catch (error) {
    console.error('Ошибка сохранения файла:', error);
    return { success: false, error: 'Не удалось сохранить файл на сервере' };
  }
}


export async function deleteFile(fileUrl: string | null | undefined) {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
    return { success: false, error: 'Некорректный путь к файлу' };
  }

  try {
    const fileName = path.basename(fileUrl);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);

    if (!filePath.startsWith(uploadDir)) {
      return { success: false, error: 'Недопустимый путь' };
    }

    unlinkSync(filePath);
    return { success: true };
  } catch (error) {
    console.warn(`Не удалось удалить файл ${fileUrl}:`, error);
    return { success: false, error: 'Файл не найден или уже был удален' };
  }
}