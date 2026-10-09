import { supabase, isSupabaseConfigured } from './client';

export interface StorageUploadResult {
  path: string;
  url: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/jfif',
  'image/heic',
  'image/heif',
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validates file constraints (MIME, size) before upload (§36, §55).
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const extension = (file.name || '').split('.').pop()?.toLowerCase();
  const isExtensionValid = ['jpg', 'jpeg', 'png', 'webp', 'jfif', 'heic', 'heif'].includes(
    extension || ''
  );
  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type);

  if (!isMimeValid && !isExtensionValid) {
    return {
      isValid: false,
      error: `Unsupported image format: ${file.type || extension}. Please upload JPG, PNG, or WebP foliage photos.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes and generates a secure random path for file uploads (§36, §55).
 */
export function generateSecureFilePath(userId: string, plantPart: string, originalName: string): string {
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(extension) ? extension : 'jpg';
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now();
  return `${userId}/${plantPart}_${timestamp}_${randomSuffix}.${cleanExt}`;
}

/**
 * Uploads plant image to private Supabase Storage bucket with signed URL generation.
 */
export async function uploadPlantImage(
  file: File,
  userId: string,
  plantPart: string
): Promise<StorageUploadResult> {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    return { path: '', url: '', error: validation.error };
  }

  const securePath = generateSecureFilePath(userId, plantPart, file.name);

  if (!isSupabaseConfigured()) {
    // Return safe local object URL in mock/development mode
    return {
      path: securePath,
      url: URL.createObjectURL(file),
    };
  }

  try {
    const { data, error } = await supabase.storage
      .from('plant-images')
      .upload(securePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { path: '', url: '', error: error.message };
    }

    // Generate time-limited signed URL for private bucket viewing
    const { data: signedData, error: signError } = await supabase.storage
      .from('plant-images')
      .createSignedUrl(data.path, 3600); // 1 hour access

    if (signError) {
      return { path: data.path, url: '', error: signError.message };
    }

    return {
      path: data.path,
      url: signedData.signedUrl,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Storage upload failure';
    return { path: '', url: '', error: msg };
  }
}
