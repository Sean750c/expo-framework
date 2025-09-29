import { apiClient } from './client';
import { GiftCard, GiftCardSubmission, GiftCardRate, UploadImageResponse } from '@/src/types/giftcard';
import { ApiResponse } from '@/src/types';

export class GiftCardService {
  /**
   * 获取所有可回收的礼品卡列表
   */
  static async getGiftCards(): Promise<GiftCard[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<GiftCard[]>('/giftcards');
    // return response.data;
    
    // 模拟数据
    return [
      {
        id: '1',
        name: 'Amazon Gift Card',
        brand: 'Amazon',
        logo: 'https://images.pexels.com/photos/6214479/pexels-photo-6214479.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'E-commerce',
        minAmount: 10,
        maxAmount: 2000,
        rate: 0.85,
        isActive: true,
        description: 'Amazon gift cards with high rates'
      },
      {
        id: '2',
        name: 'iTunes Gift Card',
        brand: 'Apple',
        logo: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Entertainment',
        minAmount: 15,
        maxAmount: 1000,
        rate: 0.80,
        isActive: true,
        description: 'iTunes and App Store gift cards'
      },
      {
        id: '3',
        name: 'Steam Gift Card',
        brand: 'Steam',
        logo: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Gaming',
        minAmount: 20,
        maxAmount: 500,
        rate: 0.75,
        isActive: true,
        description: 'Steam gaming platform gift cards'
      }
    ];
  }

  /**
   * 获取实时汇率
   */
  static async getRates(): Promise<GiftCardRate[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<GiftCardRate[]>('/giftcards/rates');
    // return response.data;
    
    return [];
  }

  /**
   * 提交礼品卡回收
   */
  static async submitGiftCard(submission: Omit<GiftCardSubmission, 'id' | 'submittedAt' | 'status'>): Promise<GiftCardSubmission> {
    // TODO: 实现API调用
    // const response = await apiClient.post<GiftCardSubmission>('/giftcards/submit', submission);
    // return response.data;
    
    return {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    } as GiftCardSubmission;
  }

  /**
   * 获取用户的礼品卡提交历史
   */
  static async getUserSubmissions(userId: string): Promise<GiftCardSubmission[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<GiftCardSubmission[]>(`/giftcards/submissions/${userId}`);
    // return response.data;
    
    return [];
  }

  /**
   * 上传礼品卡图片
   */
  static async uploadImage(imageUri: string): Promise<UploadImageResponse> {
    // TODO: 实现图片上传
    // const formData = new FormData();
    // formData.append('image', {
    //   uri: imageUri,
    //   type: 'image/jpeg',
    //   name: 'giftcard.jpg',
    // } as any);
    
    // const response = await apiClient.postRaw<UploadImageResponse>('/upload/image', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    
    // return response.data;
    
    return {
      url: imageUri,
      filename: `giftcard_${Date.now()}.jpg`
    };
  }

  /**
   * 获取礼品卡详情
   */
  static async getGiftCardById(id: string): Promise<GiftCard | null> {
    // TODO: 实现API调用
    // const response = await apiClient.get<GiftCard>(`/giftcards/${id}`);
    // return response.data;
    
    const cards = await this.getGiftCards();
    return cards.find(card => card.id === id) || null;
  }
}