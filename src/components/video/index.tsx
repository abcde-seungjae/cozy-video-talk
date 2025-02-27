import { useEffect, useRef } from "react";

const Video: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.addEventListener("click", async () => {
        try {
          if (document.pictureInPictureElement) {
            // PIP 모드에서 나가기
            await document.exitPictureInPicture();
          } else {
            // PIP 모드로 전환
            await videoElement.requestPictureInPicture();
          }
        } catch (error) {
          console.error("PIP 전환 오류:", error);
        }
      });
    }
  }, []);

  return (
    <video ref={videoRef} controls>
      <source src="your-video-url.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
