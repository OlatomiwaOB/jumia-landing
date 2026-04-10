"use client";

import { useState } from 'react';
import QRCode from 'react-qr-code';

export default function AppDownloadSection() {
  const [showQR, setShowQR] = useState(false);

  const apkDownloadUrl = "https://drive.usercontent.google.com/download?id=136ZZvBgMBFDj6U8rjn3q1KliyTlzTj7m&export=download&authuser=0";
  const appVersion = "7c";
  const fileSize = "128.4 MB";

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = apkDownloadUrl;
    link.download = `fortitude-iot-v${appVersion}.apk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm mb-4">
            <span className="w-2 h-2 bg-accent/60 rounded-full mr-2 animate-pulse"></span>
            Version {appVersion} • {fileSize}
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-4 px-6 bg-accent text-white font-bold rounded-xl text-md md:text-lg hover:bg-accent/80 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download APK for Android
          </button>

          <p className="text-sm text-gray-500 mt-3">
            Requires Android 8.0 or higher
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowQR(!showQR)}
            className="text-accent hover:text-accent/80 font-medium flex items-center justify-center gap-2 mx-auto"
          >
            {showQR ? 'Hide' : 'Show'} QR Code
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showQR ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>

          {showQR && (
            <div className="mt-6 p-6 bg-white border border-gray-200 rounded-xl inline-block">
              <div className="mb-4">
                <QRCode
                  value={typeof window !== 'undefined' ? apkDownloadUrl : apkDownloadUrl}
                  size={200}
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Scan to download on your Android device
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-accent/20 border-2 border-accent rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4 text-accent">Installation Instructions</h3>
        <ol className="space-y-3 text-gray-900">
          <li className="flex items-start gap-3">
            <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">1</span>
            <span>Tap "Download APK for Android" above</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">2</span>
            <span>You will get routed to google drive, you should click "download anyway"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">3</span>
            <span>Allow "Install from unknown sources" when prompted</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">4</span>
            <span>Open the downloaded file and follow installation steps</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">5</span>
            <span>Launch the app and sign in or sign up</span>
          </li>
        </ol>
      </div>
    </div>
  );
}