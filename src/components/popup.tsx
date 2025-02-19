import React, { useEffect, useState } from "react";
import Sign from "./sub/sign";
import Connect from "./sub/connect";

const Popup: React.FC = () => {
  const [IsAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.session.get(["isAuthenticated"], (result) => {
      if (result.isAuthenticated) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  useEffect(() => {
    function handleStorageChange(
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string
    ) {
      if (areaName === "session" && changes.isAuthenticated) {
        setIsAuthenticated(changes.isAuthenticated.newValue);
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <div className="w-80 p-4 flex justify-center items-center flex-col">
      <h1 className="mb-2 text-xl font-bold">Cozy Video Talk</h1>
      {IsAuthenticated ? <Connect /> : <Sign />}
    </div>
  );
};

export default Popup;
