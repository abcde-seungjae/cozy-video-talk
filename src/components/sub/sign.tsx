import GoogleBtn from "../../assets/image/google_btn.svg";

interface SignResponse {
  success: boolean;
  response?: ConnectProps;
  error?: unknown;
}

type ConnectProps = {
  uid: string;
  nickname: string;
  inviteCode: string;
};

const Sign: React.FC = () => {
  const google_login_click = async () => {
    // background.ts로 로그인 요청
    chrome.runtime.sendMessage(
      { action: "loginWithGoogle" },
      (response: SignResponse) => {
        if (chrome.runtime.lastError) {
          console.error("Login runtime error:", chrome.runtime.lastError);
        } else if (response.success) {
          console.log("Logged in successfully!", response);
        } else {
          console.error("Login failed:", response.error);
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
