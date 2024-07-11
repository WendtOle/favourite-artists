export interface AuthorizationTokens {
  accessToken: string;
  refreshToken: string;
  expires: number;
}

export function assertAuthorizationTokens(
  input: any
): asserts input is AuthorizationTokens {
  if (
    typeof input !== "object" ||
    typeof input.accessToken !== "string" ||
    typeof input.refreshToken !== "string" ||
    typeof input.expires !== "number"
  ) {
    throw new Error("Invalid AuthorizationTokens");
  }
}

export const AUTHORIZATION_TOKENS = "authorizationTokens";
