import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ShowToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom';
  onPress?: () => void;
  onHide?: () => void;
}

export const showToast = ({
  type,
  title,
  message,
  duration = 3000,
  position = 'top',
  onPress,
  onHide,
}: ShowToastOptions) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position,
    visibilityTime: duration,
    onPress,
    onHide,
    topOffset: 60,
    bottomOffset: 40,
  });
};

// Convenience methods
export const showSuccessToast = (title: string, message?: string) => {
  showToast({ type: 'success', title, message });
};

export const showErrorToast = (title: string, message?: string) => {
  showToast({ type: 'error', title, message });
};

export const showInfoToast = (title: string, message?: string) => {
  showToast({ type: 'info', title, message });
};

export const showWarningToast = (title: string, message?: string) => {
  showToast({ type: 'warning', title, message });
};

// Hide current toast
export const hideToast = () => {
  Toast.hide();
};

// Custom toast configurations
export const toastConfig = {
  success: ({ text1, text2, onPress }: any) => (
    <Toast
      text1={text1}
      text2={text2}
      onPress={onPress}
      style={{
        backgroundColor: '#10B981',
        borderLeftColor: '#059669',
      }}
      text1Style={{
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#F3F4F6',
        fontSize: 14,
      }}
    />
  ),
  error: ({ text1, text2, onPress }: any) => (
    <Toast
      text1={text1}
      text2={text2}
      onPress={onPress}
      style={{
        backgroundColor: '#EF4444',
        borderLeftColor: '#DC2626',
      }}
      text1Style={{
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#FEE2E2',
        fontSize: 14,
      }}
    />
  ),
  info: ({ text1, text2, onPress }: any) => (
    <Toast
      text1={text1}
      text2={text2}
      onPress={onPress}
      style={{
        backgroundColor: '#3B82F6',
        borderLeftColor: '#2563EB',
      }}
      text1Style={{
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#DBEAFE',
        fontSize: 14,
      }}
    />
  ),
  warning: ({ text1, text2, onPress }: any) => (
    <Toast
      text1={text1}
      text2={text2}
      onPress={onPress}
      style={{
        backgroundColor: '#F59E0B',
        borderLeftColor: '#D97706',
      }}
      text1Style={{
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#FEF3C7',
        fontSize: 14,
      }}
    />
  ),
};