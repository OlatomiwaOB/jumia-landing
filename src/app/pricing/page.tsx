'use client'

import React, { useState, useMemo, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstanceNoAuth from '@/utils/fetch-function-auth'
import useGetLookup from "@/app/hooks/useGetLookup"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, AlertCircle, Loader2, Calendar, Star, ChevronRight, HelpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '../../../fortitude-app/layout/header'
import Footer from '../../../fortitude-app/layout/footer'

interface SubscriptionFeature {
    featureCode: string
    name: string
    value: string
}

interface SubscriptionPlan {
    id: number
    tierCode: string
    name: string
    description: string
    subscriptionType: string
    amount: number
    currencyCode: string
    status: string
    features: SubscriptionFeature[]
}

interface LookupOption {
    id: string
    name: string
    description?: string
}

const FEATURE_DISPLAY_ORDER = [
    'DIGITAL_STOREFRONT',
    'PRODUCT_LIMIT',
    'PRODUCT_MANAGEMENT',
    'MARKET_ANALYSIS',
    'STORE_VISIBILITY',
    'BANNER_PUBLICITY',
    'PICKUP_SERVICE',
    'CUSTOMER_SUPPORT',
    'FEATURE_PRODUCT',
    'ON_SALE'
]

const fetchPlanById = async (id: number) => {
    const response = await axiosInstanceNoAuth.request({
        url: `/subscription-plan/fetch/${id}`,
        method: 'GET'
    })
    return response.data?.subscriptionList?.[0] || null
}

export default function PricingPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('YEARLY')

    const { data: plansData, isLoading: isLoadingPlans } = useQuery({
        queryKey: ['subscription-plans'],
        queryFn: () => axiosInstanceNoAuth.request({
            url: '/subscription-plan/list',
            method: 'GET'
        })
    })

    const subscriptionTypeOptions: LookupOption[] = useGetLookup('SUBSCRIPTION_TYPE')
    const tierCodeOptions: LookupOption[] = useGetLookup('TIER_CODE')

    const allPlanIds = useMemo(() => {
        return plansData?.data?.subscriptionList?.map((plan: SubscriptionPlan) => plan.id) || []
    }, [plansData])

    const planQueries = useQuery({
        queryKey: ['individual-plans', allPlanIds],
        queryFn: async () => {
            const plans: SubscriptionPlan[] = []
            for (const id of allPlanIds) {
                try {
                    const plan = await fetchPlanById(id)
                    if (plan) {
                        plans.push(plan)
                    }
                } catch (error) {
                    console.error(`Error fetching plan ${id}:`, error)
                }
            }
            return plans
        },
        enabled: allPlanIds.length > 0
    })

    const subscriptionPlans: SubscriptionPlan[] = planQueries.data || []

    const organizedPlans = useMemo(() => {
        const organization: Record<string, Record<string, SubscriptionPlan>> = {
            YEARLY: { BASIC: null, STANDARD: null, PREMIUM: null },
            WEEKLY: { BASIC: null, STANDARD: null, PREMIUM: null },
            MONTHLY: { BASIC: null, STANDARD: null, PREMIUM: null }
        }

        subscriptionPlans.forEach(plan => {
            if (plan.status === 'ACTIVE' || plan.status === 'Active') {
                const type = plan.subscriptionType
                const tier = plan.tierCode
                if (organization[type] && organization[type][tier] === null) {
                    organization[type][tier] = plan
                }
            }
        })

        return organization
    }, [subscriptionPlans])

    const getPlanByTierAndType = (tier: string, type: string): SubscriptionPlan | null => {
        return organizedPlans[type]?.[tier] || null
    }

    const getFeaturesForTier = (tier: string) => {
        const features: Record<string, string> = {}

        const samplePlan = subscriptionPlans.find(plan => plan.tierCode === tier)
        if (!samplePlan) return features

        samplePlan.features.forEach(feature => {
            features[feature.featureCode] = feature.name
        })

        return features
    }

    const getPositiveFeatures = (plan: SubscriptionPlan) => {
        if (!plan?.features) return []

        return plan.features.filter(feature => {
            const value = feature.value?.toUpperCase()
            return !['NO', ''].includes(value) && value !== undefined && value !== null
        })
    }

    const formatCurrency = (amount: number, currencyCode: string = 'NGN') => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount)
    }

    const getSubscriptionTypeName = (code: string) => {
        const option = subscriptionTypeOptions.find(opt => opt.id === code)
        return option?.name || code
    }

    const getSubscriptionTypeDescription = (code: string) => {
        const option = subscriptionTypeOptions.find(opt => opt.id === code)
        return option?.description || ''
    }

    const getTierName = (code: string) => {
        const option = tierCodeOptions.find(opt => opt.id === code)
        return option?.name || code
    }

    const getTierDescription = (code: string) => {
        const option = tierCodeOptions.find(opt => opt.id === code)
        return option?.description || ''
    }

    const isLoading = isLoadingPlans || planQueries.isLoading

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-accent-foreground animate-spin" />
                    <p className="text-accent-foreground/70">Loading subscription plans...</p>
                </div>
            </div>
        )
    }

    return (

        <Suspense>
            <Header />
            <div className="min-h-screen bg-white">
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-accent mb-6">
                            Choose Your Perfect Plan
                        </h1>
                        <p className="text-lg text-accent-foreground max-w-3xl mx-auto">
                            Flexible subscription plans designed to grow with your business. Start with what you need, upgrade when you're ready.
                        </p>
                    </div>

                    <div className="mb-16 bg-accent/5 rounded-2xl p-8 border-4 border-accent/70">
                        <h2 className="text-2xl font-semibold text-accent-foreground mb-8 text-center">
                            Understanding Your Subscription Options
                        </h2>

                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-8 bg-accent rounded-full"></div>
                                    <h3 className="text-xl font-semibold text-accent-foreground">
                                        Subscription Tiers
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {tierCodeOptions.map(tier => {
                                        return (
                                            <div key={tier.id} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-accent-foreground text-lg">
                                                        {tier.name}
                                                    </h4>
                                                </div>
                                                <p className="text-accent-foreground/80 leading-relaxed">
                                                    {tier.description || 'Comprehensive plan for businesses at this level'}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-8 bg-accent rounded-full"></div>
                                    <h3 className="text-xl font-semibold text-accent-foreground">
                                        Billing Cycles
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {subscriptionTypeOptions.map(type => {
                                        return (
                                            <div key={type.id} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold text-accent-foreground text-lg">
                                                            {type.name}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <p className="text-accent-foreground/80 leading-relaxed">
                                                    {type.description || `Billed ${type.name.toLowerCase()} for consistent access`}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-accent-foreground mb-4">
                                Plans & Pricing
                            </h2>
                            <p className="text-lg text-accent-foreground/70">
                                Select your preferred billing cycle to view available plans
                            </p>
                        </div>

                        <Tabs defaultValue="YEARLY" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="flex justify-center mb-12">
                                <TabsList className="grid w-full max-w-md grid-cols-3 bg-accent/5 p-1 rounded-xl">
                                    {subscriptionTypeOptions.map(type => (
                                        <TabsTrigger
                                            key={type.id}
                                            value={type.id}
                                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                                        >
                                            {type.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            {subscriptionTypeOptions.map(type => (
                                <TabsContent key={type.id} value={type.id} className="mt-0">
                                    <div className="grid md:grid-cols-3 gap-8 items-stretch">
                                        {['BASIC', 'STANDARD', 'PREMIUM'].map((tier, index) => {
                                            const plan = getPlanByTierAndType(tier, type.id)
                                            const isStandard = tier === 'STANDARD'
                                            const isMostPopular = isStandard

                                            return (
                                                <div key={`${tier}-${type.id}`} className="relative h-full">
                                                    {isMostPopular && (
                                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                                            <Badge className="bg-accent text-white px-4 py-1.5 rounded-full shadow-lg">
                                                                <Star className="w-3 h-3 mr-1" />
                                                                Most Popular
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    <Card className={`h-full border-2 ${isMostPopular ? 'border-accent bg-accent/5' : 'border-gray-200'} transition-all duration-300 hover:shadow-xl`}>
                                                        <CardHeader className={`${isMostPopular ? 'pt-10' : 'pt-8'} pb-6`}>
                                                            <div className="text-center">
                                                                <CardTitle className="text-2xl font-bold text-accent-foreground mb-2">
                                                                    {getTierName(tier)}
                                                                </CardTitle>
                                                                {plan ? (
                                                                    <>
                                                                        <div className="mb-4">
                                                                            <span className="text-4xl font-bold text-accent-foreground">
                                                                                {formatCurrency(plan.amount, plan.currencyCode)}
                                                                            </span>
                                                                            <span className="text-accent-foreground/70 ml-2">
                                                                                / {type.name.toLowerCase()}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-accent-foreground/80 text-sm">
                                                                            {plan.description}
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <div className="py-8">
                                                                        <div className="text-lg font-semibold text-accent-foreground mb-2">
                                                                            Coming Soon
                                                                        </div>
                                                                        <p className="text-accent-foreground/70 text-sm">
                                                                            We're working on this plan
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardHeader>

                                                        <CardContent>
                                                            {plan ? (
                                                                <>
                                                                    <Button
                                                                        className={`w-full ${isMostPopular ? 'bg-accent hover:bg-accent/90 text-white' : 'bg-white hover:bg-accent/10 text-accent border border-accent'}`}
                                                                        onClick={() => router.push('/business-onboarding')}
                                                                    >
                                                                        Get Started
                                                                        <ChevronRight className="w-4 h-4 ml-2" />
                                                                    </Button>

                                                                    <Separator className="my-6" />

                                                                    <div className="space-y-3">
                                                                        <h4 className="font-medium text-accent-foreground mb-2 text-sm">
                                                                            Key Features:
                                                                        </h4>

                                                                        {tier === 'BASIC' && (
                                                                            <div className="space-y-2">
                                                                                {getPositiveFeatures(plan).map(feature => (
                                                                                    <div key={feature.featureCode} className="flex items-start gap-2">
                                                                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                                                        <span className="text-sm text-accent-foreground">
                                                                                            {feature.name}
                                                                                            {feature.featureCode === 'PRODUCT_LIMIT' && feature.value !== 'UNLIMITED' && (
                                                                                                <span className="text-accent-foreground/70 ml-1">
                                                                                                    (Up to {feature.value} products)
                                                                                                </span>
                                                                                            )}
                                                                                            {feature.featureCode === 'PRODUCT_LIMIT' && feature.value === 'UNLIMITED' && (
                                                                                                <span className="text-accent-foreground/70 ml-1">
                                                                                                    (Unlimited)
                                                                                                </span>
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}

                                                                        {(tier === 'STANDARD' || tier === 'PREMIUM') && (
                                                                            <div className="space-y-3">
                                                                                <div className="space-y-2">
                                                                                    <p className="text-xs text-accent-foreground/70 font-medium mb-1">
                                                                                        Includes all Basic features, plus:
                                                                                    </p>
                                                                                    {getPositiveFeatures(plan).map(feature => {
                                                                                        const basicPlan = getPlanByTierAndType('BASIC', type.id)
                                                                                        if (basicPlan) {
                                                                                            const basicFeature = basicPlan.features.find(f => f.featureCode === feature.featureCode)
                                                                                            if (basicFeature && basicFeature.value === feature.value) {
                                                                                                return null
                                                                                            }
                                                                                        }

                                                                                        return (
                                                                                            <div key={feature.featureCode} className="flex items-start gap-2">
                                                                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                                                                <span className="text-sm text-accent-foreground">
                                                                                                    {feature.name}
                                                                                                    {feature.featureCode === 'PRODUCT_LIMIT' && feature.value !== 'UNLIMITED' && (
                                                                                                        <span className="text-accent-foreground/70 ml-1">
                                                                                                            (Up to {feature.value} products)
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {feature.featureCode === 'PRODUCT_LIMIT' && feature.value === 'UNLIMITED' && (
                                                                                                        <span className="text-accent-foreground/70 ml-1">
                                                                                                            (Unlimited)
                                                                                                        </span>
                                                                                                    )}
                                                                                                </span>
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-not-allowed"
                                                                    disabled
                                                                >
                                                                    Coming Soon
                                                                </Button>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>

                    <div className="mb-16">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-accent-foreground mb-4">
                                Feature Comparison
                            </h2>
                            <p className="text-lg text-accent-foreground/70">
                                Compare all features across our subscription tiers
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-accent/10 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-full divide-y divide-accent/10">
                                    <thead>
                                        <tr className="bg-accent/5">
                                            <th className="text-left p-6 font-semibold text-accent-foreground text-lg">
                                                Features
                                            </th>
                                            {['BASIC', 'STANDARD', 'PREMIUM'].map(tier => (
                                                <th key={tier} className="text-center p-6 font-semibold text-accent-foreground text-lg">
                                                    {getTierName(tier)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-accent/10">
                                        {FEATURE_DISPLAY_ORDER.map(featureCode => {
                                            const samplePlan = subscriptionPlans[0]
                                            const sampleFeature = samplePlan?.features.find(f => f.featureCode === featureCode)
                                            if (!sampleFeature) return null

                                            return (
                                                <tr key={featureCode} className="hover:bg-accent/5 transition-colors">
                                                    <td className="p-6 text-sm font-medium text-accent-foreground">
                                                        {sampleFeature.name}
                                                    </td>

                                                    {['BASIC', 'STANDARD', 'PREMIUM'].map(tier => {
                                                        const plan = getPlanByTierAndType(tier, 'YEARLY')
                                                        const feature = plan?.features.find(f => f.featureCode === featureCode)
                                                        const value = feature?.value || ''

                                                        return (
                                                            <td key={tier} className="p-6 text-center">
                                                                {value ? (
                                                                    <div className="flex flex-col items-center justify-center gap-1">
                                                                        {value === 'YES' || value === 'UNLIMITED' ||
                                                                            ['ADVANCED', 'ENHANCED', 'PRIORITY', 'STANDARD'].includes(value) ? (
                                                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                                                        ) : value === 'NO' ? (
                                                                            <XCircle className="w-5 h-5 text-red-500" />
                                                                        ) : value === '' ? (
                                                                            <AlertCircle className="w-5 h-5 text-gray-400" />
                                                                        ) : (
                                                                            <AlertCircle className="w-5 h-5 text-gray-400" />
                                                                        )}
                                                                        <span className="text-sm text-accent-foreground mt-1">
                                                                            {featureCode === 'PRODUCT_LIMIT' && value === 'UNLIMITED'
                                                                                ? 'Unlimited'
                                                                                : featureCode === 'PRODUCT_LIMIT' && value && value !== 'YES' && value !== 'NO'
                                                                                    ? `Up to ${value}`
                                                                                    : value === 'YES' ? 'Yes'
                                                                                        : value === 'NO' ? 'No'
                                                                                            : value}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-sm text-accent-foreground/50">—</span>
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/5 rounded-2xl p-12 mb-10">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                                <HelpCircle className="w-6 h-6 text-accent" />
                            </div>
                            <h2 className="text-3xl font-bold text-accent-foreground mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-accent-foreground/70">
                                Get answers to common questions about our subscription plans
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-accent/10 shadow-sm">
                                <h3 className="font-semibold text-accent-foreground text-lg mb-3">
                                    Can I change my plan later?
                                </h3>
                                <p className="text-accent-foreground/80">
                                    Yes, you can upgrade or downgrade your subscription plan at any time from your account settings.
                                    Changes take effect at the start of your next billing cycle, and we'll prorate any differences.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-accent/10 shadow-sm">
                                <h3 className="font-semibold text-accent-foreground text-lg mb-3">
                                    How does billing work for different cycles?
                                </h3>
                                <p className="text-accent-foreground/80">
                                    For yearly plans, you'll be charged annually. Monthly plans bill on the same date each month, and weekly plans
                                    bill every 7 days. All charges are automated through your selected payment method.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-accent/10 shadow-sm">
                                <h3 className="font-semibold text-accent-foreground text-lg mb-3">
                                    Is there a contract or long-term commitment?
                                </h3>
                                <p className="text-accent-foreground/80">
                                    No, all our plans are month-to-month (or equivalent for monthlylink/weekly plans) with no long-term contracts.
                                    You can cancel anytime with no cancellation fees.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-accent/10 shadow-sm">
                                <h3 className="font-semibold text-accent-foreground text-lg mb-3">
                                    What payment methods do you accept?
                                </h3>
                                <p className="text-accent-foreground/80">
                                    We accept direct debit from your Fortitude Direct wallet, bank transfers, and major credit/debit cards.
                                    All payment methods are securely processed and encrypted.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-accent/10 shadow-sm">
                                <h3 className="font-semibold text-accent-foreground text-lg mb-3">
                                    Can I get a refund if I cancel?
                                </h3>
                                <p className="text-accent-foreground/80">
                                    We offer prorated refunds for unused time if you cancel mid-cycle. Refunds are processed within
                                    5-7 business days to your original payment method.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-accent/10 shadow-sm">
                                <h3 className="font-semibold text-accent-foreground text-lg mb-3">
                                    How do I contact support for billing questions?
                                </h3>
                                <p className="text-accent-foreground/80">
                                    Our support team is available 24/7 through our contact page.
                                    For billing-specific questions, you can also email info@fortitudeiot.com.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-accent-foreground/70">
                                Still have questions?{' '}
                                <button
                                    onClick={() => router.push('/contact')}
                                    className="text-accent font-semibold hover:underline"
                                >
                                    Contact our support team
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Suspense>
    )
}