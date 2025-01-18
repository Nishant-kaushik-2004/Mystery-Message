import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const CookieEnableGuide = () => {
  const [browser, setBrowser] = useState<"chrome" | "firefox" | "safari" | "edge" | "other">("chrome");
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    detectBrowser();
  }, []);

  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) setBrowser("chrome");
    else if (userAgent.includes("Firefox")) setBrowser("firefox");
    else if (userAgent.includes("Safari")) setBrowser("safari");
    else if (userAgent.includes("Edge")) setBrowser("edge");
    else setBrowser("other");
  };

  const getBrowserInstructions = () => {
    const instructions = {
      chrome: [
        "Click the menu icon (⋮) in the top-right corner",
        'Select "Settings"',
        'Click "Privacy and security"',
        'Click "Cookies and other site data"',
        'Enable "Allow sites to save and read cookie data"',
      ],
      firefox: [
        "Click the menu icon (≡) in the top-right corner",
        'Select "Settings"',
        'Click "Privacy & Security"',
        'Under "Enhanced Tracking Protection", select "Standard" or "Custom"',
        'Ensure "Cookies" are not fully blocked',
      ],
      safari: [
        'Click "Safari" in the top menu',
        'Select "Preferences"',
        'Click the "Privacy" tab',
        'Uncheck "Block all cookies"',
      ],
      edge: [
        "Click the menu icon (⋯) in the top-right corner",
        'Select "Settings"',
        'Click "Cookies and site permissions"',
        'Click "Manage and delete cookies and site data"',
        'Enable "Allow sites to save and read cookie data"',
      ],
      other: [
        "Open your browser settings",
        "Look for Privacy or Security settings",
        "Find Cookie settings",
        "Enable cookies for websites",
      ],
    };

    return instructions[browser] || instructions.other;
  };

  return (
    <div className=" pt-4 md:pt-6 flex flex-col">
      <Button
        onClick={() => setShowGuide(!showGuide)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white md:mx-auto"
      >
        {showGuide ? "Hide Instructions" : "How to Enable Cookies"}
      </Button>

      {showGuide && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            How to Enable Cookies in{" "}
            {browser.charAt(0).toUpperCase() + browser.slice(1)}
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            {getBrowserInstructions().map((instruction, index) => (
              <li key={index} className="text-gray-700">
                {instruction}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-gray-500">
            After enabling cookies, refresh the page to continue.
          </p>
        </div>
      )}
    </div>
  );
};
export default CookieEnableGuide;
