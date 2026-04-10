import { Metadata } from "next";
import Header from "../../../fortitude-app/layout/header";
import Footer from "../../../fortitude-app/layout/footer";
import { Suspense } from "react";
import AppDownloadSection from "@/components/get-the-app/AppDownloadSection";
import FeedbackForm from "@/components/get-the-app/FeedbackForm";

export const metadata: Metadata = {
    title: "Get Fortitude IoT App | Download Now",
    description: "Download Fortitude IoT app for Android. Experience our digital marketplace for shopping, financial services, and digital products.",
};

export default function GetTheApp() {
    return (
        <>
            <Suspense>
                <Header />
                <div className="mb-30 container mx-auto py-12 px-4 md:px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                                Get the Fortitude IoT App
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Download our app to access a complete digital marketplace with shopping,
                                financial services, and exclusive digital products.
                            </p>

                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                                <AppDownloadSection />
                            </div>
                        </div>

                        <div>
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                                    Share Your Feedback
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    We'd love to hear your thoughts about the Fortitude IoT app.
                                    Your feedback helps us improve your experience.
                                </p>

                                <FeedbackForm />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </Suspense>
        </>
    );
}