"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ANIMATION_VARIANTS, ENTERPRISE_EASE } from "@/lib/constants/animations";
import type { ProductReviewItem } from "@/lib/data/product-detail";

interface ProductReviewsProps {
  reviews: ProductReviewItem[];
}

const StarIcon: React.FC = () => (
  <svg
    className="h-4 w-4 fill-amber-500 text-amber-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
  </svg>
);

export const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("productDetail");

  if (!reviews || reviews.length === 0) return null;

  const reviewsTitle = t("reviewsTitle", { defaultMessage: "Let's see what users have to say:" });
  const highlightWord = t("reviewsTitleHighlight", { defaultMessage: "users" });

  return (
    <section className="relative w-full bg-[#FAFAFA] py-20 sm:py-24 select-none border-t border-zinc-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          title={reviewsTitle}
          highlightWord={highlightWord}
          align="center"
          light
          className="mb-10 sm:mb-14"
        />

        {/* 2x2 Reviews Grid */}
        <motion.div
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {reviews.map((review, i) => {
            // Check if review needs translation or has dynamic translation key
            const author = t(`reviews.items.${review.author}.author`, { defaultMessage: review.author });
            const content = t(`reviews.items.${review.author}.content`, { defaultMessage: review.content });

            return (
              <motion.div
                key={`${review.author}-${i}`}
                variants={ANIMATION_VARIANTS.fadeUp}
                whileHover={
                  reduceMotion
                    ? {}
                    : {
                        y: -4,
                        boxShadow: "0 12px 24px -10px rgba(0,0,0,0.08)",
                        borderColor: "rgba(31, 168, 79, 0.2)",
                      }
                }
                transition={{ duration: 0.5, ease: ENTERPRISE_EASE }}
                className="flex flex-col justify-between rounded-xl border border-zinc-100 bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300"
              >
                <div>
                  {/* Author & Stars */}
                  <div className="flex items-center justify-between gap-4 border-b border-zinc-50 pb-4 mb-4">
                    <span className="text-base font-bold text-zinc-800">
                      {author}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, starIdx) => (
                        <StarIcon key={starIdx} />
                      ))}
                    </div>
                  </div>

                  {/* Review content */}
                  <p className="text-sm font-semibold leading-relaxed text-zinc-500 text-left">
                    {content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* More reviews linkage */}
        <div className="mt-12 flex flex-col items-center justify-center gap-1.5 text-center">
          <motion.a
            href="#"
            whileHover={{ y: -1 }}
            className="text-sm font-bold text-zinc-500 hover:text-brand-green transition-colors underline underline-offset-4"
          >
            {t("moreReviews", { defaultMessage: "More reviews" })}
          </motion.a>
          <span className="text-zinc-400 font-bold tracking-widest">...</span>
        </div>
      </div>
    </section>
  );
};
