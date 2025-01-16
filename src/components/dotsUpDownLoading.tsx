import React from "react";
import { motion } from "framer-motion";

const bounceVariants = {
  animate: (i: number) => ({
    y: [0, -6, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: i * 0.2,
    },
  }),
};

function DotsUpAndDownLoadingAnimation() {
  return (
    <div className="flex justify-center items-center h-7 gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={bounceVariants}
          animate="animate"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "#e5e7eb",
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}

export default DotsUpAndDownLoadingAnimation;
