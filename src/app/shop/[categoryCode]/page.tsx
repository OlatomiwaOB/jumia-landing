import React, { Suspense } from 'react'
// Depot Theme Imports
import DepotLayout from '../../../../themes/depot/layout'
import DepotCategoryContent from '../../../../themes/depot/components/shop/depot-category-content'

// Fortitude Theme Imports
import FortitudeLayout from '../../../../themes/fortitude/layout'
import FortitudeCategoryContent from '../../../../themes/fortitude/components/shop/fortitude-category-content'

// Vogue Theme Imports
import VogueLayout from '../../../../themes/vogue/layout'
import VogueCategoryContent from '../../../../themes/vogue/components/shop/vogue-category-content'

// Traditional Taste Theme Imports
import TraditionalTasteLayout from '../../../../themes/traditional-taste-v2/layout'
import TraditionalTasteCategoryContent from '../../../../themes/traditional-taste-v2/components/shop/traditional-taste-category-content'

const CategoryPage = () => {
    const storefront = process.env.NEXT_PUBLIC_STORE_FRONT;
    const isDepot = storefront === 'depot';

    if (isDepot) {
        return (
            <DepotLayout>
                <Suspense fallback={<div className="min-h-screen bg-white" />}>
                    <DepotCategoryContent />
                </Suspense>
            </DepotLayout>
        )
    }

    if (storefront === 'vogue') {
        return (
            <VogueLayout>
                <Suspense fallback={<div className="min-h-screen bg-white" />}>
                    <VogueCategoryContent />
                </Suspense>
            </VogueLayout>
        )
    }

    if (storefront === 'traditional-taste-v2') {
        return (
            <TraditionalTasteLayout>
                <Suspense fallback={<div className="min-h-screen bg-white" />}>
                    <TraditionalTasteCategoryContent />
                </Suspense>
            </TraditionalTasteLayout>
        )
    }

    return (
        <FortitudeLayout>
            <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <FortitudeCategoryContent />
            </Suspense>
        </FortitudeLayout>
    )
}

export default CategoryPage
