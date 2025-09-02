import { useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useAppStore } from '@/src/store/appStore';

export const useNetwork = () => {
  const { isOnline, setOnlineStatus } = useAppStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setOnlineStatus(state.isConnected || false);
    });

    return unsubscribe;
  }, [setOnlineStatus]);

  return { isOnline };
};