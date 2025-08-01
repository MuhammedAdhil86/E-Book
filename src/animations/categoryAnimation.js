// src/motion/variants.js
export const fadeContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

export const fadeItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 120,
    },
  },
};
