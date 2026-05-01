import type { Station } from "@/utils/AppInterfaces";

const DB_NAME = 'RailSetuDB';
const STORE_NAME = 'stations_cache';
const DB_VERSION = 1;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveStationsLocal = async (data: Station[]): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, 'all_stations');

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getStationsLocal = async (): Promise<Station[] | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('all_stations');

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};