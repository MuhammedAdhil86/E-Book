// src/animations/subscriptionVariants.js

export const containerFadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 1,        // slower entrance
    ease: "easeOut",
  },
};

export const planCardVariant = (index) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay: 0.6 + index * 0.4, // staggered & slow reveal
    duration: 0.8,
    ease: "easeOut",
  },
  whileHover: {
    scale: 1.03,
    transition: { duration: 0.3 },
  },
});
