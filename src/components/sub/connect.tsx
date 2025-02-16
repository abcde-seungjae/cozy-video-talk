import BtnOff from "../assets/image/btn_on.png";
import BtnOn from "../assets/image/btn_off.png";
import { useEffect, useState } from "react";

const Connect: React.FC = () => {
  const [IsConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get(["isConnected"], (result) => {
      if (result.isAuthenticated) {
        setIsConnected(true);
      }
    });
  }, []);

  return (
    <div>
      <button onClick={() => {}} className="cursor-pointer">
        {IsConnected ? <img src={BtnOff} /> : <img src={BtnOn} />}
      </button>
    </div>
  );
};

export default Connect;
