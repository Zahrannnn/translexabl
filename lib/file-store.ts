// Shared in-memory store for translated files
// In production, you should use a proper cache like Redis or database storage
// This is a temporary solution for serverless environments

interface StoredFile {
  buffer: Buffer
  filename: string
  contentType: string
  originalFileName: string
  createdAt: Date
}

class FileStore {
  private store = new Map<string, StoredFile>()

  set(fileId: string, fileData: Omit<StoredFile, 'createdAt'>) {
    this.store.set(fileId, {
      ...fileData,
      createdAt: new Date()
    })
    
    // Auto-cleanup after 1 hour
    setTimeout(() => {
      this.delete(fileId)
    }, 60 * 60 * 1000)
  }

  get(fileId: string): StoredFile | undefined {
    return this.store.get(fileId)
  }

  delete(fileId: string): boolean {
    const deleted = this.store.delete(fileId)
    if (deleted) {
      console.log(`Cleaned up translated file ${fileId} from memory`)
    }
    return deleted
  }

  // Cleanup expired files (older than 1 hour)
  cleanup() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    for (const [fileId, fileData] of this.store.entries()) {
      if (fileData.createdAt < oneHourAgo) {
        this.delete(fileId)
      }
    }
  }

  // Get store size for monitoring
  size(): number {
    return this.store.size
  }
}

// Create a singleton instance
export const translatedFilesStore = new FileStore()

// Periodic cleanup every 30 minutes
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    translatedFilesStore.cleanup()
  }, 30 * 60 * 1000)
} 