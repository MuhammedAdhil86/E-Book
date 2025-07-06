// src/animations/subscriptionVariants.js

export const containerFadeIn = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.8, 0.25, 1], // Smooth entrance
    },
  },
};

// Plan card animation with staggered reveal and hover effect
export const planCardVariant = (index) => ({
  initial: {
    opacity: 0,
    y: 60,
    scale: 0.97,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.4 + index * 0.3, // Stagger by index
      duration: 0.9,
      ease: [0.25, 0.8, 0.25, 1],
    },
  },
  whileHover: {
    scale: 1.03,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
});
