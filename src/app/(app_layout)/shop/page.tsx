import React, { Suspense } from 'react'
import { ThemeShopContent } from '@theme/exports'

/**
 * Shop Page — uses build-time @theme alias.
 * Only the selected storefront's shop content is bundled.
 */
const Shop = () => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ThemeShopContent />
        </Suspense>
    )
}

export default Shop