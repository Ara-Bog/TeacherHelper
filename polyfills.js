// Compatibility shims for RN 0.84 API removals that older (unmaintained)
// libraries in the dependency tree still call. Imported first in index.js so
// the patched APIs exist before any component mounts.
import {BackHandler} from 'react-native';

// react-native-modal@13 calls `BackHandler.removeEventListener` on every modal
// unmount, but RN 0.84 removed that static method — `addEventListener` now
// returns a subscription with `.remove()`. Without this shim, unmounting any
// modal throws "undefined is not a function".
//
// We reimplement removeEventListener correctly by tracking each handler's
// subscription, so listeners are actually removed (no leak) rather than no-op'd.
if (typeof BackHandler.removeEventListener !== 'function') {
  const subscriptions = new Map();
  const originalAdd = BackHandler.addEventListener.bind(BackHandler);

  BackHandler.addEventListener = (eventName, handler) => {
    const subscription = originalAdd(eventName, handler);
    subscriptions.set(handler, subscription);
    return subscription;
  };

  BackHandler.removeEventListener = (eventName, handler) => {
    const subscription = subscriptions.get(handler);
    if (subscription) {
      subscription.remove();
      subscriptions.delete(handler);
    }
  };
}
