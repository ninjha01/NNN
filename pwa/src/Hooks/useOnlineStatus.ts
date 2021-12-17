import { useState, useEffect } from "react";
export function useOnlineStatus() {
  const [isOnline, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const wentOnlineCallback = () => setOnline(true);
    const wentOfflineCallback = () => setOnline(false);
    window.addEventListener("offline", wentOfflineCallback);
    window.addEventListener("online", wentOnlineCallback);
    return () => {
      window.removeEventListener("offline", wentOfflineCallback);
      window.removeEventListener("online", wentOnlineCallback);
    };
  });

  return isOnline;
}
