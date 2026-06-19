export interface RefreshUseCaseInterface {
  /**
   * Rotates the refresh token and issues a new access token.
   *
   * The user is resolved from the refresh token stored in DB, so the previous
   * access token is optional — this enables cookie-only refresh (needed for SSR
   * clients that don't keep the access token around).
   */
  executeRefresh: (
    refreshTokenValue: string,
    accessToken?: string,
  ) => Promise<{ accessToken: string; refreshToken: string }>;
}
