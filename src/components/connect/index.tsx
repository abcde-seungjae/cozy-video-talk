import { useEffect, useState } from "react";

import { UserType } from "../sign";
import { onConnectChange } from "../../lib/connect";

import BtnOff from "../../assets/image/btn_off.png";
import BtnOn from "../../assets/image/btn_on.png";

const Connect: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserType>({} as UserType);

  useEffect(() => {
    chrome.storage.session.get(["isConnected", "userInfo"], (result) => {
      if (result.isConnected) {
        setIsConnected(true);
      }

      if (result.userInfo) {
        setUserInfo(result.userInfo);
      }
    });
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          setIsConnected(!isConnected);
          onConnectChange();
        }}
        className="cursor-pointer flex justify-center w-full"
      >
        {isConnected ? <img src={BtnOn} /> : <img src={BtnOff} />}
      </button>
      <div
        className={`flex p-2 mt-4 w-full items-center  ${
          isConnected ? "bg-white" : "bg-gray-200"
        }`}
      >
        <label className="w-32 text-center">초대코드 입력</label>
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
        <label className="w-32 text-center">초대코드</label>
        <p
          className={`ml-2 pl-2 pb-1 w-full border-b border-gray-500 min-h-6 ${
            isConnected ? "text-black select-auto" : "text-gray-500 select-none"
          }`}
        >
          {userInfo.inviteCode}
        </p>
      </div>
    </div>
  );
};

export default Connect;
