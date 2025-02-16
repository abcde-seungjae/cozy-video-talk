import GoogleBtn from "../assets/image/google_btn.svg";

const Video: React.FC = () => {
  const google_login_click = () => {
    // background.ts로 로그인 요청
    chrome.runtime.sendMessage(
      { action: "loginWithGoogle" },
      function (response) {
        // 로그인 후 처리할 로직 (access_token 등)
        console.log("Logged in successfully!", response);
      }
    );
  };

  return (
    <button onClick={google_login_click} className="cursor-pointer">
      <img src={GoogleBtn} />
    </button>
  );
};

export default Video;
