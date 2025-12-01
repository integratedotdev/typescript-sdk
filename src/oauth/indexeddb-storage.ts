/**
 * IndexedDB Storage for OAuth Tokens
 * Manages token storage with support for multiple accounts per provider
 */

import type { ProviderTokenData, AccountInfo } from "./types.js";

const DB_NAME = "integrate_oauth_tokens";
const DB_VERSION = 1;
const STORE_NAME = "tokens";

/**
 * Token store entry structure
 */
export interface TokenStoreEntry {
  /** Provider name (e.g., 'github', 'gmail') */
  provider: string;
  /** User email address */
  email: string;
  /** Unique account ID (provider + email hash) */
  accountId: string;
  /** Token data */
  tokenData: ProviderTokenData;
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
}


/**
 * IndexedDB Storage Manager
 * Handles all IndexedDB operations for token storage
 */
export class IndexedDBStorage {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  /**
   * Initialize IndexedDB database
   * Creates database and object store if they don't exist
   */
  private async init(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        reject(new Error("IndexedDB is not available in this environment"));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        this.initPromise = null;
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initPromise = null;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "accountId" });

          // Create indexes
          store.createIndex("provider", "provider", { unique: false });
          store.createIndex("email", "email", { unique: false });
          store.createIndex("provider_email", ["provider", "email"], { unique: true });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Generate account ID from provider and email
   */
  private generateAccountId(provider: string, email: string): string {
    // Simple hash function for account ID
    const str = `${provider}:${email}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `${provider}_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Save token for a provider and email
   */
  async saveToken(
    provider: string,
    email: string,
    tokenData: ProviderTokenData
  ): Promise<void> {
    const db = await this.init();
    const accountId = this.generateAccountId(provider, email);
    const now = Date.now();

    const entry: TokenStoreEntry = {
      provider,
      email,
      accountId,
      tokenData,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      // Check if entry exists to preserve createdAt
      const getRequest = store.get(accountId);
      getRequest.onsuccess = () => {
        const existing = getRequest.result as TokenStoreEntry | undefined;
        if (existing) {
          entry.createdAt = existing.createdAt;
        }

        const putRequest = store.put(entry);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(new Error(`Failed to save token: ${putRequest.error?.message}`));
      };

      getRequest.onerror = () => reject(new Error(`Failed to check existing token: ${getRequest.error?.message}`));
    });
  }

  /**
   * Get token for a provider and email
   */
  async getToken(provider: string, email: string): Promise<ProviderTokenData | undefined> {
    const db = await this.init();
    const accountId = this.generateAccountId(provider, email);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(accountId);

      request.onsuccess = () => {
        const entry = request.result as TokenStoreEntry | undefined;
        resolve(entry?.tokenData);
      };

      request.onerror = () => reject(new Error(`Failed to get token: ${request.error?.message}`));
    });
  }

  /**
   * Get all tokens for a provider (all accounts)
   */
  async getTokensByProvider(provider: string): Promise<Map<string, ProviderTokenData>> {
    const db = await this.init();
    const tokens = new Map<string, ProviderTokenData>();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("provider");
      const request = index.getAll(provider);

      request.onsuccess = () => {
        const entries = request.result as TokenStoreEntry[];
        for (const entry of entries) {
          tokens.set(entry.email, entry.tokenData);
        }
        resolve(tokens);
      };

      request.onerror = () => reject(new Error(`Failed to get tokens: ${request.error?.message}`));
    });
  }

  /**
   * List all accounts for a provider
   */
  async listAccounts(provider: string): Promise<AccountInfo[]> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("provider");
      const request = index.getAll(provider);

      request.onsuccess = () => {
        const entries = request.result as TokenStoreEntry[];
        const accounts: AccountInfo[] = entries.map((entry) => ({
          email: entry.email,
          accountId: entry.accountId,
          expiresAt: entry.tokenData.expiresAt,
          scopes: entry.tokenData.scopes,
          createdAt: entry.createdAt,
        }));
        resolve(accounts);
      };

      request.onerror = () => reject(new Error(`Failed to list accounts: ${request.error?.message}`));
    });
  }

  /**
   * Delete token for a provider and email
   */
  async deleteToken(provider: string, email: string): Promise<void> {
    const db = await this.init();
    const accountId = this.generateAccountId(provider, email);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(accountId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete token: ${request.error?.message}`));
    });
  }

  /**
   * Delete all tokens for a provider
   */
  async deleteTokensByProvider(provider: string): Promise<void> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("provider");
      const request = index.getAll(provider);

      request.onsuccess = () => {
        const entries = request.result as TokenStoreEntry[];
        // Delete all entries by their accountId (primary key)
        const deletePromises = entries.map((entry) => {
          return new Promise<void>((resolveDelete, rejectDelete) => {
            const deleteRequest = store.delete(entry.accountId);
            deleteRequest.onsuccess = () => resolveDelete();
            deleteRequest.onerror = () => rejectDelete(deleteRequest.error);
          });
        });

        Promise.all(deletePromises)
          .then(() => resolve())
          .catch((error) => reject(error));
      };

      request.onerror = () => reject(new Error(`Failed to delete tokens: ${request.error?.message}`));
    });
  }

  /**
   * Clear all tokens
   */
  async clearAll(): Promise<void> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear tokens: ${request.error?.message}`));
    });
  }
}

