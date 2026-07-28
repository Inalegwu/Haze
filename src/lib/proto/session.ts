import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessionStorage } from '@skymarshal/sdk/auth';

export const asyncStorageAdapter: SessionStorage = {
  get: (key) => AsyncStorage.getItem(key),
  set: (key, value) => AsyncStorage.setItem(key, value),
  remove: (key) => AsyncStorage.removeItem(key),
};
