import Lottie from "lottie-react";
import animationData from "@/public/animations/Gaming community.json";

const HomeAnimation = () => {
  return (
    <div className="lottie-container w-full h-auto aspect-square bg-transparent">
      <Lottie 
        animationData={animationData} 
        loop 
        className="w-full h-full"
        style={{ background: '!transparent' }}
      />
    </div>
  );
}

export default HomeAnimation;