import { create } from 'zustand';
import { GiftCard, GiftCardSubmission } from '@/src/types/giftcard';
import { GiftCardService } from '@/src/api/giftCardService';
import { logger } from '@/src/utils/logger';

interface GiftCardStore {
  giftCards: GiftCard[];
  submissions: GiftCardSubmission[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchGiftCards: () => Promise<void>;
  fetchSubmissions: (userId: string) => Promise<void>;
  submitGiftCard: (submission: Omit<GiftCardSubmission, 'id' | 'submittedAt' | 'status'>) => Promise<GiftCardSubmission>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useGiftCardStore = create<GiftCardStore>((set, get) => ({
  giftCards: [],
  submissions: [],
  loading: false,
  error: null,

  fetchGiftCards: async () => {
    try {
      set({ loading: true, error: null });
      const giftCards = await GiftCardService.getGiftCards();
      set({ giftCards, loading: false });
      logger.info('Gift cards fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch gift cards:', error);
    }
  },

  fetchSubmissions: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const submissions = await GiftCardService.getUserSubmissions(userId);
      set({ submissions, loading: false });
      logger.info('Submissions fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch submissions:', error);
    }
  },

  submitGiftCard: async (submission) => {
    try {
      set({ loading: true, error: null });
      const newSubmission = await GiftCardService.submitGiftCard(submission);
      set(state => ({
        submissions: [newSubmission, ...state.submissions],
        loading: false
      }));
      logger.info('Gift card submitted successfully');
      return newSubmission;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to submit gift card:', error);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),
}));