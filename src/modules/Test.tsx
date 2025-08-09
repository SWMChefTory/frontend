/* eslint-disable @typescript-eslint/no-unused-vars */
import {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, AppState, AppStateStatus, NativeModules} from 'react-native';

const useSharedData = () => {
  const {ShareModule, CustomShareModule} = NativeModules;
  const appState = useRef(AppState.currentState);
  const [activeAppState, setActiveAppState] = useState(appState.current);
  const [sharedUrl, setSharedUrl] = useState<string>('');

  const checkSharedData = useCallback(() => {
    if (ShareModule && ShareModule.receiveSharedData) {
      ShareModule?.receiveSharedData((error: string, data: string) => {
        if (data) {
          Alert.alert('Shared Data', data);
          setSharedUrl(data);
        } else {
          console.log(error);
        }
      });
    }
  }, [ShareModule]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        checkSharedData();
      }
      appState.current = nextAppState;
      setActiveAppState(appState.current);
    },
    [checkSharedData],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    checkSharedData();

    return () => {
      subscription.remove();
    };
  }, [checkSharedData, handleAppStateChange]);

  const clearSharedText = () => {
    setSharedUrl('');
    if (CustomShareModule && CustomShareModule.clearSharedText) {
      CustomShareModule.clearSharedText();
    }
  };

  return {
    sharedUrl,
    clearSharedText,
  };
};

export default useSharedData;