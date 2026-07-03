import {useEffect, useCallback} from 'react';
import {BackHandler} from 'react-native';

// BackHandler effect with cleanup
// handler should return true to prevent default back behavior
export default function useBackHandler(handler, enabled = true) {
  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    if (!enabled) return;
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      stableHandler,
    );
    return () => subscription.remove();
  }, [enabled, stableHandler]);
}
