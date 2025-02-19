import BtnOff from "../../assets/image/btn_off.png";
import BtnOn from "../../assets/image/btn_on.png";
import { useEffect, useState } from "react";
import { UserType } from "./sign";

const Connect: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserType>({} as UserType);

  useEffect(() => {
    chrome.storage.session.get(["isConnected", "userInfo"], (result) => {
      console.error(result.isConnected);
      if (result.isConnected) {
        setIsConnected(true);
      }

      if (result.userInfo) {
        setUserInfo(result.userInfo);
      }
    });
  }, []);

  const onConnectChange = () => {
    setIsConnected(!isConnected);
    chrome.storage.session.set({ isConnected: !isConnected });

    chrome.runtime.sendMessage(
      {
        action: "connectChange",
        isConnected: !isConnected,
      },
      function (response) {
        console.log("Connect changed successfully!", response);
      }
    );
  };

  return (
    <div>
      <button
        onClick={onConnectChange}
        className="cursor-pointer flex justify-center w-full"
      >
        {isConnected ? <img src={BtnOn} /> : <img src={BtnOff} />}
      </button>
      <div
        className={`flex p-2 mt-4 w-full items-center  ${
          isConnected ? "bg-white" : "bg-gray-200"
        }`}
      >
        <label className="w-32 text-center">초대코드 입력: </label>
        <div className="flex ml-2 w-full border-b border-gray-500">
          <input className="min-h-6 w-full pl-2" disabled={!isConnected} />
          <button className="rounded bg-black text-white px-2 py-1 text-nowrap cursor-pointer">
            확인
          </button>
        </div>
      </div>
      <div
        className={`flex p-2 mt-4 w-full items-center  ${
          isConnected ? "bg-white" : "bg-gray-200"
        }`}
      >
        <label className="w-32 text-center">초대코드: </label>
        <p className="ml-2 ps-2 w-full border-b border-gray-500 min-h-6">
          {userInfo.inviteCode}
        </p>
      </div>
    </div>
  );
};

export default Connect;
