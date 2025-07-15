// src/animations/motionVariants.js
export const mobileMenuVariants = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: {
    type: 'tween',
    duration: 0.6, // slower transition
    ease: [0.25, 0.8, 0.25, 1], // ease-in-out cubic
  },
};

export const searchBarVariants = {
  initial: { opacity: 0, y: -15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: {
    duration: 0.4,
    ease: 'easeOut',
  },
};
