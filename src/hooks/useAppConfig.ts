import { useAppStore } from '@/src/store/appStore';
import { AppInitResponse } from '@/src/api/appService';

export const useAppConfig = () => {
  const { appConfig } = useAppStore();

  return {
    appConfig,
    // Helper functions to access specific config values
    getContactInfo: () => ({
      servicePhone: appConfig?.service_phone,
      whatsappPhone: appConfig?.whatsapp_phone,
      email: appConfig?.email,
      whatsappEnable: appConfig?.whatsapp_enable,
    }),
    getFeatureFlags: () => ({
      googleLoginEnable: appConfig?.google_login_enable,
      facebookLoginEnable: appConfig?.facebook_login_enable,
      appleLoginEnable: appConfig?.apple_login_enable,
      biometricEnable: appConfig?.biometric_enable,
      checkinEnable: appConfig?.checkin_enable,
      lotteryEnable: appConfig?.lottery_enable,
      utilityEnable: appConfig?.utility_enable,
      socialEnable: appConfig?.social_enable,
    }),
    getUrls: () => ({
      fqaUrl: appConfig?.fqa_url,
      vipUrl: appConfig?.vip_url,
      shareLink: appConfig?.share_link,
      widgetUrl: appConfig?.widget_url,
    }),
    getUpdateInfo: () => ({
      isUpdate: appConfig?.is_update,
      forceUpdate: appConfig?.force_update,
      apkUrl: appConfig?.apk_url,
      iosUrl: appConfig?.ios_url,
      apkSize: appConfig?.apk_size,
    }),
    getFees: () => ({
      platformFee: appConfig?.platform_fee,
      recommendFee: appConfig?.recommend_fee,
    }),
  };
};