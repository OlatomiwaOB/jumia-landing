import React, { Suspense } from 'react'
// Depot Theme Imports
import DepotLayout from '../../../themes/depot/layout'
import DepotShopContent from '../../../themes/depot/components/shop/depot-shop-content'

// Fortitude Theme Imports
import FortitudeLayout from '../../../themes/fortitude/layout'
import FortitudeShopContent from '../../../themes/fortitude/components/shop/fortitude-shop-content'

// Vogue Theme Imports
import VogueLayout from '../../../themes/vogue/layout'
import VogueShopContent from '../../../themes/vogue/components/shop/vogue-shop-content'

// Traditional Taste Theme Imports
import TraditionalTasteLayout from '../../../themes/traditional-taste-v2/layout'
import TraditionalTasteShopContent from '../../../themes/traditional-taste-v2/components/shop/traditional-taste-shop-content'

// Varisa Theme Imports
import VarisaLayout from '../../../themes/varisa/layout'
import VarisaShopContent from '../../../themes/varisa/page'

const Shop = () => {
    const storefront = process.env.NEXT_PUBLIC_STORE_FRONT;
    const isDepot = storefront === 'depot';

    if (isDepot) {
        return (
            <DepotLayout>
                <Suspense fallback={<div className="min-h-screen bg-white" />}>
                    <DepotShopContent />
                </Suspense>
            </DepotLayout>
        )
    }

    if (storefront === 'vogue') {
        return (
            <VogueLayout>
                <Suspense fallback={<div className="min-h-screen bg-white" />}>
                    <VogueShopContent />
                </Suspense>
            </VogueLayout>
        )
    }

    if (storefront === 'traditional-taste-v2') {
        return (
            <TraditionalTasteLayout>
                <Suspense fallback={<div className="min-h-screen bg-white" />}>
                    <TraditionalTasteShopContent />
                </Suspense>
            </TraditionalTasteLayout>
        )
    }

    if (storefront === 'varisa') {
        return (
            <VarisaLayout>
                <Suspense fallback={<div className="min-h-screen bg-white" />}>
                    <VarisaShopContent />
                </Suspense>
            </VarisaLayout>
        )
    }

    return (
        <FortitudeLayout>
            <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <FortitudeShopContent />
            </Suspense>
        </FortitudeLayout>
    )
}

export default Shop