import type { ProviderTokenData } from "../oauth/types.js";
import type { ProviderTokenRecord } from "./types.js";

const USABLE_ACCESS_TOKEN_BUFFER_MS = 30 * 1000;
const MIN_MEANINGFUL_EXPIRY_MS = Date.UTC(2000, 0, 1);

function getRowUpdatedAtMs(row: ProviderTokenRecord) {
  return row.updatedAt instanceof Date ? row.updatedAt.getTime() : 0;
}

export function normalizeAccountEmail(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function normalizeAccountEmailHint(value?: string | null): string | null {
  const normalized = normalizeAccountEmail(value);
  if (!normalized) return null;
  return normalized.includes("@") ? normalized : null;
}

export function normalizeAccountIdentifier(value?: string | null): string | null {
  return normalizeAccountEmail(value);
}

export function normalizeAccountIdHint(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function normalizeProviderTokenType(value?: string | null): string {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : "Bearer";
}

export function hasMeaningfulExpiresAt(value: Date | null | undefined): value is Date {
  if (!value) return false;
  const ms = value.getTime();
  return Number.isFinite(ms) && ms >= MIN_MEANINGFUL_EXPIRY_MS;
}

export function hasUsableAccessToken(
  row: ProviderTokenRecord,
  now = Date.now(),
  bufferMs = USABLE_ACCESS_TOKEN_BUFFER_MS
) {
  if (!row.accessToken) return false;
  const expiresAt = row.expiresAt;
  if (!hasMeaningfulExpiresAt(expiresAt)) return true;
  return expiresAt.getTime() > now + bufferMs;
}

export function isLikelyUsableToken(row: ProviderTokenRecord, now = Date.now()) {
  return hasUsableAccessToken(row, now) || Boolean(row.refreshToken);
}

export function parseScopes(scope: string | null | undefined): string[] | undefined {
  if (!scope) return undefined;
  const scopes = scope
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return scopes.length > 0 ? scopes : undefined;
}

function choosePreferredTokenRow(
  rows: ProviderTokenRecord[]
): ProviderTokenRecord | undefined {
  if (rows.length === 0) return undefined;

  const sorted = [...rows].sort(
    (left, right) => getRowUpdatedAtMs(right) - getRowUpdatedAtMs(left)
  );

  return (
    sorted.find((row) => hasUsableAccessToken(row)) ??
    sorted.find((row) => Boolean(row.refreshToken)) ??
    sorted[0]
  );
}

export function selectProviderTokenRow(
  rows: ProviderTokenRecord[],
  email?: string,
  accountId?: string
): ProviderTokenRecord | undefined {
  if (rows.length === 0) {
    return undefined;
  }

  const normalizedEmail = normalizeAccountEmailHint(email);
  const normalizedAccountId = normalizeAccountIdHint(accountId);

  if (normalizedAccountId && normalizedEmail) {
    const exactBoth = rows.filter(
      (row) =>
        normalizeAccountIdHint(row.accountId) === normalizedAccountId &&
        normalizeAccountEmail(row.accountEmail) === normalizedEmail
    );
    if (exactBoth.length > 0) {
      return choosePreferredTokenRow(exactBoth);
    }
  }

  if (normalizedAccountId) {
    const exactAccountId = rows.filter(
      (row) => normalizeAccountIdHint(row.accountId) === normalizedAccountId
    );
    if (exactAccountId.length > 0) {
      return choosePreferredTokenRow(exactAccountId);
    }
  }

  if (normalizedEmail) {
    const exactEmail = rows.filter(
      (row) => normalizeAccountEmail(row.accountEmail) === normalizedEmail
    );
    if (exactEmail.length > 0) {
      return choosePreferredTokenRow(exactEmail);
    }
  } else if (email) {
    const normalizedIdentifier = normalizeAccountIdentifier(email);
    if (normalizedIdentifier) {
      const identifierMatches = rows.filter(
        (row) =>
          normalizeAccountIdHint(row.accountId) === normalizedIdentifier
      );
      if (identifierMatches.length > 0) {
        return choosePreferredTokenRow(identifierMatches);
      }
    }
  }

  if (normalizedAccountId || normalizedEmail) {
    const legacyRows = rows.filter(
      (row) =>
        !normalizeAccountIdHint(row.accountId) &&
        !normalizeAccountEmail(row.accountEmail)
    );
    if (legacyRows.length === 1) {
      return choosePreferredTokenRow(legacyRows);
    }
    return undefined;
  }

  return choosePreferredTokenRow(rows);
}

export function providerTokenRecordToData(
  row: ProviderTokenRecord
): ProviderTokenData {
  const expiresAt = hasMeaningfulExpiresAt(row.expiresAt) ? row.expiresAt : null;
  const expiresIn = expiresAt
    ? Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
    : 3600;

  return {
    accessToken: row.accessToken,
    refreshToken: row.refreshToken ?? undefined,
    tokenType: normalizeProviderTokenType(row.tokenType),
    expiresIn,
    expiresAt: expiresAt?.toISOString(),
    scopes: parseScopes(row.scope),
    email: row.accountEmail ?? undefined,
    accountId: row.accountId ?? undefined,
  };
}

export function defaultResolveAccountIdentity(
  provider: string,
  tokenData: ProviderTokenData,
  emailHint: string | null
): { accountEmail: string | null; accountId: string | null } {
  const accountEmail = normalizeAccountEmail(emailHint ?? tokenData.email ?? null);
  let accountId = normalizeAccountIdHint(tokenData.accountId ?? null);

  if (!accountId && accountEmail) {
    accountId = `${provider}:${accountEmail}`;
  }

  return { accountEmail, accountId };
}
