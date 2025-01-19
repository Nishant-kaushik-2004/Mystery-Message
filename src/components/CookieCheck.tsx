import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CookieEnableGuide from "./CookieEnableGuide";

// Component to check cookie status
const CookieCheck = () => {
  const [cookiesDisabled, setCookiesDisabled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    checkCookieStatus();
  }, []);

  const checkCookieStatus = () => {
    try {
      document.cookie = "cookieTest=1";
      const cookieEnabled = document.cookie.indexOf("cookieTest=") !== -1;
      // document.cookie = "cookieTest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      setCookiesDisabled(!cookieEnabled);
    } catch {
      setCookiesDisabled(true);
    }
  };

  if (!showBanner || !cookiesDisabled) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-50 ">
      <Alert className="relative max-w-3xl mx-auto bg-yellow-50 border-yellow-200">
        <AlertTitle className="text-yellow-800 text-lg font-semibold">
          Cookies are Disabled
        </AlertTitle>
        <AlertDescription className="text-yellow-700 mt-2">
          This website requires cookies to function properly. Please enable
          cookies to continue.
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900"
          onClick={() => setShowBanner(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <CookieEnableGuide/>
      </Alert>
    </div>
  );
};

// Export both components
export default CookieCheck;
