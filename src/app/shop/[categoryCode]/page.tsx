import React, { Suspense } from 'react'
// Depot Theme Imports
import DepotLayout from '../../../../themes/depot/layout'
import DepotCategoryContent from '../../../../themes/depot/components/shop/depot-category-content'

// Fortitude Theme Imports
import FortitudeLayout from '../../../../themes/fortitude/layout'
import FortitudeCategoryContent from '../../../../themes/fortitude/components/shop/fortitude-category-content'

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

    return (
        <FortitudeLayout>
            <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <FortitudeCategoryContent />
            </Suspense>
        </FortitudeLayout>
    )
}

export default CategoryPage
