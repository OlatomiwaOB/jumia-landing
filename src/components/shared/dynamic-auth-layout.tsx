import React from 'react';
import { AuthLayoutProps } from './default-auth-layout';
import { ThemeAuthLayout } from '@theme/exports';

/**
 * Dynamic Auth Layout — uses build-time @theme alias.
 * Only the selected storefront's auth layout is bundled.
 * Themes without a custom auth layout re-export the shared default via their stub.
 */
export default function DynamicAuthLayout(props: AuthLayoutProps) {
  return <ThemeAuthLayout {...props} />;
}
