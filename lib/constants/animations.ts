export const ENTERPRISE_EASE = [0.22, 1, 0.36, 1] as const;

export const PREMIUM_SPRING = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 1,
} as const;

export const ANIMATION_VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.97 },
    show: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 24 },
    show: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -24 },
    show: { opacity: 1, x: 0 },
  },
  staggerContainer: {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.02,
      },
    },
  },
};

export const STAGGER_CONTAINER = ANIMATION_VARIANTS.staggerContainer;

export const TILT_SPRING = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 0.4,
} as const;

export const KEN_BURNS_TRANSITION = {
  duration: 14,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "mirror",
} as const;

export const WORD_REVEAL_VARIANTS = {
  hidden: { y: "110%" },
  show: { y: "0%" },
};

export const TRANSITION_DEFAULTS = {
  duration: 0.8,
  ease: ENTERPRISE_EASE,
};

export const HOVER_PRESETS = {
  button: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },
  card: {
    hover: {
      y: -6,
      scale: 1.01,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.06)",
    },
    tap: { scale: 0.99 },
  },
  icon: {
    hover: { x: 4 },
  },
};

