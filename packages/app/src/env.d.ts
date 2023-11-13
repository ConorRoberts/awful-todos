/* eslint-disable @typescript-eslint/consistent-type-imports */
/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("./utils/auth").Auth;
  type DatabaseUserAttributes = {
    id: string;
    name: string;
    provider_id: import("./utils/auth").OAuthProvider | "email";
    provider_user_id: string | null;
    email: string | null;
    oauth_user_data: string | null;
    email_verified: boolean;
  };
  type DatabaseSessionAttributes = {};
}

/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    auth: import("lucia").AuthRequest;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_WEBSITE_URL: string;

  readonly STRIPE_PUBLIC_KEY: string;
  readonly STRIPE_SECRET_KEY: string;

  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;

  readonly DATABASE_URL: string;
  readonly DATABASE_AUTH_TOKEN?: string;

  readonly CLOUDFLARE_IMAGES_API_KEY: string;
  readonly CLOUDFLARE_ACCOUNT_ID: string;

  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
