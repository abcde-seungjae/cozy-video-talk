import GoogleBtn from "../../assets/image/google_btn.svg";

interface SignResponse {
  success: boolean;
  response?: UserType;
  error?: unknown;
}

export type UserType = {
  uid: string;
  nickname: string;
  inviteCode: string;
};

const Sign: React.FC = () => {
  const google_login_click = async () => {
    // background.ts로 로그인 요청
    chrome.runtime.sendMessage(
      { action: "loginWithGoogle" },
      (res: SignResponse) => {
        if (chrome.runtime.lastError) {
          console.error("Login runtime error:", chrome.runtime.lastError);
        } else if (res.success) {
          console.log("Logged in successfully!", res);

          chrome.storage.session.set({
            userInfo: res.response,
            isAuthenticated: true,
          });
        } else {
          console.error("Login failed:", res.error);
        }
      }
    );
  };

  return (
    <button onClick={google_login_click} className="cursor-pointer">
      <img src={GoogleBtn} alt="Google Login Button" />
    </button>
  );
};

export default Sign;
