
'use client';
import { AlertCircle } from 'lucide-react';

export default function DocumentsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-accent/10 rounded-full p-4">
                        <AlertCircle className="w-8 h-8 text-accent/60" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Api Keys
                </h1>

                <p className="text-gray-600 mb-6">
                    This feature is coming soon. We're working hard to bring you a seamless way to access and manage your api keys.
                </p>

                <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                        ✓ Seamless Integration<br />
                        ✓ Full Support<br />     
                    </p>
                </div>

                <p className="text-xs text-gray-400 mt-8">
                    Stay tuned for updates
                </p>
            </div>
        </div>
    );
}