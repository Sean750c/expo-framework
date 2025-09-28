import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import MD5 from "crypto-js/md5";
import config from '@/src/config';

export interface DeviceInfo {
  os_type: string;
  device_no: string;
  device_type: string;
}

export class SignatureUtils {
  private static deviceInfo: DeviceInfo | null = null;

  /**
   * Get device information
   */
  static async getDeviceInfo(): Promise<DeviceInfo> {
    if (this.deviceInfo) {
      return this.deviceInfo;
    }

    try {
      const deviceId = await this.getDeviceId();
      const deviceType = this.getDeviceType();
      const osType = this.getOSType();

      this.deviceInfo = {
        os_type: osType,
        device_no: deviceId,
        device_type: deviceType,
      };

      return this.deviceInfo;
    } catch (error) {
      // Fallback device info
      this.deviceInfo = {
        os_type: Platform.OS === 'web' ? 'web' : Platform.OS,
        device_no: this.generateFallbackDeviceId(),
        device_type: Platform.OS === 'web' ? 'Web Browser' : 'Unknown Device',
      };

      return this.deviceInfo;
    }
  }

  /**
   * Get device ID
   */
  private static async getDeviceId(): Promise<string> {
    try {
      if (Platform.OS === 'web') {
        // For web, use a stored device ID or generate one
        const storedId = localStorage.getItem('device_id');
        if (storedId) {
          return storedId;
        }
        
        const newId = this.generateFallbackDeviceId();
        localStorage.setItem('device_id', newId);
        return newId;
      }

      // For mobile platforms, try to get a unique identifier
      const deviceId = Device.osInternalBuildId || 
                      Device.osBuildId || 
                      this.generateFallbackDeviceId();
      
      return deviceId;
    } catch (error) {
      return this.generateFallbackDeviceId();
    }
  }

  /**
   * Generate fallback device ID
   */
  private static generateFallbackDeviceId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
  }

  /**
   * Get device type
   */
  private static getDeviceType(): string {
    if (Platform.OS === 'web') {
      return navigator.userAgent || 'Web Browser';
    }

    return Device.modelName || Device.deviceName || `${Platform.OS} Device`;
  }

  /**
   * Get OS type
   */
  private static getOSType(): string {
    switch (Platform.OS) {
      case 'ios':
        return 'ios';
      case 'android':
        return 'android';
      case 'web':
        return 'web';
      default:
        return Platform.OS;
    }
  }

  /**
   * Generate signature for API requests
   */
  static async generateSignature(params: Record<string, any>): Promise<string> {
    const appConfig = config();
    const deviceInfo = await this.getDeviceInfo();

    // Merge base params with request params
    const allParams: Record<string, any> = {
      appid: appConfig.APP_ID,
      version: appConfig.APP_VERSION,
      os_type: deviceInfo.os_type,
      device_no: deviceInfo.device_no,
      device_type: deviceInfo.device_type,
      ...params,
    };

    // Sort parameters by key and create query string
    const sortedKeys = Object.keys(allParams).sort();
    const queryString = sortedKeys
      .map(key => `${key}=${allParams[key]}`)
      .join('&');

    // Create signature string
    const signatureString = queryString + appConfig.APP_KEY;

    // 生成 MD5
  let signature: string;
  if (Platform.OS === "web") {
    // Web 端用 crypto-js
    signature = MD5(signatureString).toString();
  } else {
    // RN 原生端用 expo-crypto
    signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.MD5,
      signatureString
    );
  }

    return signature.toLowerCase();
  }

  /**
   * Prepare request parameters with signature
   */
  static async prepareRequestParams(params: Record<string, any> = {}): Promise<Record<string, any>> {
    const appConfig = config();
    const deviceInfo = await this.getDeviceInfo();

    // Base parameters that are included in every request
    const baseParams = {
      appid: appConfig.APP_ID,
      version: appConfig.APP_VERSION,
      os_type: deviceInfo.os_type,
      device_no: deviceInfo.device_no,
      device_type: deviceInfo.device_type,
      ...params,
    };

    // Generate signature
    const signature = await this.generateSignature(params);

    return {
      ...baseParams,
      sign: signature,
    };
  }
}