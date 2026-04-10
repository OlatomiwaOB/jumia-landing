import React, { Suspense } from 'react'
import StoreContent from './pageContent'
import Footer from '../../../fortitude-app/layout/footer'
import Header from '../../../fortitude-app/layout/header'

const Store = () => {
    return <>
        <Header />
        <div className='py-20'>
            <StoreContent />
        </div>
        <Footer />
    </>
}

export default Store