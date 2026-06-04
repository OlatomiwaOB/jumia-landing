import { Suspense, lazy } from 'react'
import { Metadata } from 'next'
import Loader from '@/components/ui/loader'

const entityObject = {
  'depot': {
    name: 'DEPOT | Contact'
  },
  'fortitude': {
    name: 'FORTITUDE | Contact'
  },
  'vogue': {
    name: 'VOGUE | Contact'
  },
  'traditional-taste-v2': {
    name: 'Traditional Taste | Contact Us'
  },
  'varisa': {
    name: 'VARISA | Contact'
  }
}

export const metadata: Metadata = {
  title: entityObject[process?.env?.NEXT_PUBLIC_STORE_FRONT as keyof typeof entityObject]?.name || 'Shop | Contact',
}

// Lazy loading components
const ContactPageDepot = lazy(() => import('../../../../themes/depot/contact'))
const ContactPageFortitude = lazy(() => import('../../../../themes/fortitude/contact'))
const ContactPageVogue = lazy(() => import('../../../../themes/vogue/contact'))
const ContactPageTraditionalTaste = lazy(() => import('../../../../themes/traditional-taste-v2/contact'))
const ContactPageVarisa = lazy(() => import('../../../../themes/varisa/contact'))

const ContactPage = () => {
  const storefront = process?.env?.NEXT_PUBLIC_STORE_FRONT;

  if (storefront === 'depot') {
    return <Suspense fallback={<Loader text='Loading...' />}><ContactPageDepot /></Suspense>
  }

  if (storefront === 'vogue') {
    return <Suspense fallback={<Loader text='Loading...' />}><ContactPageVogue /></Suspense>
  }

  if (storefront === 'traditional-taste-v2') {
    return <Suspense fallback={<Loader text='Loading...' />}><ContactPageTraditionalTaste /></Suspense>
  }

  if (storefront === 'varisa') {
    return <Suspense fallback={<Loader text='Loading...' />}><ContactPageVarisa /></Suspense>
  }

  return <Suspense fallback={<Loader text='Loading...' />}><ContactPageFortitude /></Suspense>
}

export default ContactPage
