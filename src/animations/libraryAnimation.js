// src/animations/bookVariants.js

export const sectionFadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export const headingFadeIn = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.2 },
};

export const cardVariant = (index) => ({
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    delay: index * 0.05,
    duration: 0.3,
    ease: "easeOut",
  },
  whileHover: { scale: 1.02 },
});
