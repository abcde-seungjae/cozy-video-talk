import BtnOff from "../../assets/image/btn_off.png";
import BtnOn from "../../assets/image/btn_on.png";
import { useEffect, useState } from "react";

const Connect: React.FC = () => {
  const [IsConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get(["isConnected"], (result) => {
      if (result.IsConnected) {
        setIsConnected(true);
      }
    });

    // background.ts로 로그인 요청
    chrome.runtime.sendMessage({ action: "loginWithGoogle" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Login runtime error:", chrome.runtime.lastError);
      } else if (response.success) {
        console.debug("Logged in successfully!", response);
      } else {
        console.error("Login failed:", response.error);
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
