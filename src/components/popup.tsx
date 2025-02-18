import React, { useEffect, useState } from "react";
import Sign from "./sub/sign";
import Connect from "./sub/connect";

const Popup: React.FC = () => {
  const [IsAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get(["isAuthenticated"], (result) => {
      console.log(result.isAuthenticated);
      if (result.isAuthenticated) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  return (
    <div className="w-80 p-4">
      <h1 className="mb-2 text-xl font-bold">Cozy Video Talk</h1>
      {IsAuthenticated ? <Connect /> : <Sign />}
    </div>
  );
};

export default Popup;
