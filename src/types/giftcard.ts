export interface GiftCard {
  id: string;
  name: string;
  brand: string;
  logo: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  rate: number; // 回收比例 0-1
  isActive: boolean;
  description?: string;
}

export interface GiftCardSubmission {
  id: string;
  userId: string;
  giftCardId: string;
  giftCardName: string;
  amount: number;
  cardNumber?: string;
  cardPin?: string;
  images: string[];
  submittedAt: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'paid';
  estimatedValue: number;
  actualValue?: number;
  rejectionReason?: string;
  processedAt?: string;
}

export interface GiftCardRate {
  giftCardId: string;
  rate: number;
  updatedAt: string;
}

export interface UploadImageResponse {
  url: string;
  filename: string;
}