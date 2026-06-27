import React, { Suspense } from 'react'
import { ThemeCategoryContent } from '@theme/exports'

/**
 * Category Page — uses build-time @theme alias.
 * Only the selected storefront's category content is bundled.
 */
const CategoryPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ThemeCategoryContent />
        </Suspense>
    )
}

export default CategoryPage
