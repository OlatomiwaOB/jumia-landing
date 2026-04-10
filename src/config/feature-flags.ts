"use client"

/**
 * Feature Flags Configuration
 * 
 * Routes listed here are hidden in production but visible in development.
 * When a feature is ready for production, remove it from this list.
 */

// Routes that are still in development and should be hidden in production
const DEVELOPMENT_ONLY_ROUTES = [
    '/borrower/request-limit-increase',
    '/borrower/borrow-and-trade',
    '/borrower/swap-money',
    '/borrower/add-beneficiaries',
    '/borrower/create-wallets',
    '/bill-payments',
    '/bill-payments/[billerCode]',
    '/business-onboarding/choose-theme',
    '/business-onboarding/set-up-store',
] as const;

/**
 * Check if the current environment is development
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Check if a route is enabled (visible) in the current environment
 * @param route - The route path to check
 * @returns true if the route should be visible, false otherwise
 */
export function isRouteEnabled(route: string): boolean {
    // In development, all routes are enabled
    if (isDevelopment) return true;

    // In production, check if the route is in the development-only list
    return !DEVELOPMENT_ONLY_ROUTES.some(devRoute => route.startsWith(devRoute));
}

/**
 * Filter an array of navigation items based on feature flags
 * @param items - Array of items with href property
 * @returns Filtered array with only enabled routes
 */
export function filterEnabledRoutes<T extends { href: string }>(items: T[]): T[] {
    return items.filter(item => isRouteEnabled(item.href));
}

/**
 * Get all development-only routes (useful for middleware)
 */
export function getDevelopmentOnlyRoutes(): readonly string[] {
    return DEVELOPMENT_ONLY_ROUTES;
}
