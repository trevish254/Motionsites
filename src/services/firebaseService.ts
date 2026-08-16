import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MotionPrompt, PromptMedia } from '../types';

export interface UserFavoriteDoc {
  promptId: string;
  userId: string;
  createdAt: string;
}

export interface PromptLikeDoc {
  promptId: string;
  userId: string;
  createdAt: string;
}

// Subscribe to all public prompt media in real time
export function subscribeAllPromptMedia(
  onUpdate: (mediaMap: Record<string, PromptMedia>) => void
): () => void {
  const path = 'prompt_media';
  try {
    const q = query(collection(db, 'prompt_media'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const mediaMap: Record<string, PromptMedia> = {};
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.mediaUrl) {
            mediaMap[docSnap.id] = {
              promptId: docSnap.id,
              mediaUrl: data.mediaUrl,
              mediaType: data.mediaType || 'image',
              aspectRatio: data.aspectRatio || '16:9',
              caption: data.caption || '',
              uploadedBy: data.uploadedBy || 'Designer',
              userId: data.userId || '',
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt || new Date().toISOString(),
            };
          }
        });
        onUpdate(mediaMap);
      },
      (error) => {
        console.warn('Firestore prompt_media subscription warning:', error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('Firestore prompt_media init warning:', error);
    return () => {};
  }
}

// Save or update attached media for a prompt
export async function savePromptMediaFirestore(media: PromptMedia): Promise<void> {
  const path = `prompt_media/${media.promptId}`;
  try {
    const mediaDocRef = doc(db, 'prompt_media', media.promptId);
    await setDoc(
      mediaDocRef,
      {
        promptId: media.promptId,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        aspectRatio: media.aspectRatio || '16:9',
        caption: media.caption || '',
        uploadedBy: media.uploadedBy || 'Designer',
        userId: media.userId || '',
        updatedAt: new Date().toISOString(),
        createdAt: media.createdAt || new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete media attached to a prompt
export async function deletePromptMediaFirestore(promptId: string): Promise<void> {
  const path = `prompt_media/${promptId}`;
  try {
    const mediaDocRef = doc(db, 'prompt_media', promptId);
    await deleteDoc(mediaDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to a user's favorited prompt IDs in real time
export function subscribeUserFavorites(
  userId: string,
  onUpdate: (favoritePromptIds: string[]) => void
): () => void {
  const path = `users/${userId}/favorites`;
  try {
    const q = query(collection(db, 'users', userId, 'favorites'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ids = snapshot.docs.map((d) => d.id);
        onUpdate(ids);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Toggle a prompt favorite in Firestore
export async function toggleFavoriteFirestore(
  userId: string,
  promptId: string,
  shouldFavorite: boolean
): Promise<void> {
  const path = `users/${userId}/favorites/${promptId}`;
  try {
    const favoriteDocRef = doc(db, 'users', userId, 'favorites', promptId);
    if (shouldFavorite) {
      await setDoc(favoriteDocRef, {
        promptId,
        userId,
        createdAt: new Date().toISOString(),
      });
    } else {
      await deleteDoc(favoriteDocRef);
    }
  } catch (error) {
    handleFirestoreError(error, shouldFavorite ? OperationType.CREATE : OperationType.DELETE, path);
  }
}

// Subscribe to user custom/remixed prompts
export function subscribeCustomPrompts(
  userId: string,
  onUpdate: (prompts: MotionPrompt[]) => void
): () => void {
  const path = `users/${userId}/custom_prompts`;
  try {
    const q = query(collection(db, 'users', userId, 'custom_prompts'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const customPrompts: MotionPrompt[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || 'Untitled Custom Prompt',
            category: data.category || 'Custom & Remixes',
            type: data.type || 'Custom Interaction',
            is_free: data.is_free ?? true,
            page_type: data.page_type || 'hero',
            platform: data.platform || 'website',
            description: data.description || '',
            prompt_text: data.prompt_text || '',
            extractedTags: data.extractedTags || ['custom', 'remix'],
            extractedFonts: data.extractedFonts || [],
            extractedAssets: data.extractedAssets || [],
          };
        });
        onUpdate(customPrompts);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Save a custom / remixed prompt to Firestore
export async function saveCustomPromptFirestore(
  userId: string,
  prompt: MotionPrompt
): Promise<void> {
  const path = `users/${userId}/custom_prompts/${prompt.id}`;
  try {
    const promptDocRef = doc(db, 'users', userId, 'custom_prompts', prompt.id);
    await setDoc(
      promptDocRef,
      {
        id: prompt.id,
        userId,
        title: prompt.title,
        category: prompt.category,
        type: prompt.type,
        page_type: prompt.page_type || 'hero',
        platform: prompt.platform || 'website',
        description: prompt.description,
        prompt_text: prompt.prompt_text,
        is_free: prompt.is_free ?? true,
        extractedTags: prompt.extractedTags || [],
        extractedFonts: prompt.extractedFonts || [],
        extractedAssets: prompt.extractedAssets || [],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete a custom prompt from Firestore
export async function deleteCustomPromptFirestore(
  userId: string,
  promptId: string
): Promise<void> {
  const path = `users/${userId}/custom_prompts/${promptId}`;
  try {
    const promptDocRef = doc(db, 'users', userId, 'custom_prompts', promptId);
    await deleteDoc(promptDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
