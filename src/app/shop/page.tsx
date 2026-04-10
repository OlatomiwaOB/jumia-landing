import React, { Suspense } from 'react'
import ShopContent from './pageContent'
import Footer from '../../../fortitude-app/layout/footer'
import Header from '../../../fortitude-app/layout/header'

const Shop = () => {
  return <>
    <Header />
    <Suspense>
      <ShopContent />
    </Suspense>
    <Footer />
  </>
}

export default Shop