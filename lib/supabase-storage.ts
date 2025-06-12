import { getSupabaseClient } from "./supabase"

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  MOODBOARDS: "moodboards",
  SCREENS: "screens",
}

// Initialize storage buckets
export const initStorageBuckets = async () => {
  const supabase = getSupabaseClient()

  // Create buckets if they don't exist
  for (const bucket of Object.values(STORAGE_BUCKETS)) {
    const { data, error } = await supabase.storage.getBucket(bucket)

    if (error && error.message.includes("not found")) {
      await supabase.storage.createBucket(bucket, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      })
    }
  }
}

// Upload file to storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
): Promise<{ url: string | null; error: Error | null }> => {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (error) {
    console.error("Error uploading file:", error)
    return { url: null, error }
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return { url: publicUrlData.publicUrl, error: null }
}

// Delete file from storage
export const deleteFile = async (bucket: string, path: string): Promise<{ success: boolean; error: Error | null }> => {
  const supabase = getSupabaseClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    console.error("Error deleting file:", error)
    return { success: false, error }
  }

  return { success: true, error: null }
}

// Get signed URL for private files
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn = 60, // seconds
): Promise<{ url: string | null; error: Error | null }> => {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    console.error("Error getting signed URL:", error)
    return { url: null, error }
  }

  return { url: data.signedUrl, error: null }
}
