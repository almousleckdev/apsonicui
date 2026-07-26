"use client";

import { useTranslations } from "next-intl";
import { useContactForm } from "@/hooks/forms/useContactForm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Send, User, Mail, Phone, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const ContactForm = () => {
  const t = useTranslations("contact.form");
  const {
    register,
    errors,
    isSubmitting,
    submitStatus,
    errorMessage,
    onSubmit,
    resetStatus,
  } = useContactForm();

  if (submitStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center p-8 sm:p-16 bg-white rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/40"
      >
        <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h3 className="text-3xl font-black text-zinc-950 mb-3 uppercase tracking-wide">
          {t("successTitle")}
        </h3>
        <p className="text-zinc-500 leading-relaxed text-sm mb-8 max-w-sm font-semibold">
          {t("successDescription")}
        </p>
        <Button
          onClick={resetStatus}
          variant="outline"
          className="border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 rounded-full font-bold text-xs uppercase tracking-widest px-8 h-12"
        >
          {t("sendAnother")}
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Input
              label={t("firstNameLabel")}
              placeholder={t("firstNamePlaceholder")}
              error={errors.firstName?.message}
              disabled={isSubmitting}
              icon={<User className="w-4 h-4 text-zinc-400" />}
              {...register("firstName")}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Input
              label={t("lastNameLabel")}
              placeholder={t("lastNamePlaceholder")}
              error={errors.lastName?.message}
              disabled={isSubmitting}
              icon={<User className="w-4 h-4 text-zinc-400" />}
              {...register("lastName")}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Input
              type="email"
              label={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              error={errors.email?.message}
              disabled={isSubmitting}
              icon={<Mail className="w-4 h-4 text-zinc-400" />}
              {...register("email")}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Input
              type="tel"
              label={t("phoneLabel")}
              placeholder={t("phonePlaceholder")}
              error={errors.phone?.message}
              disabled={isSubmitting}
              icon={<Phone className="w-4 h-4 text-zinc-400" />}
              {...register("phone")}
            />
          </motion.div>
        </div>

        {/* Department Select */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          className="w-full"
        >
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
            {t("departmentLabel")}
          </label>
          <div className="relative">
            <select
              disabled={isSubmitting}
              className="flex h-12 w-full appearance-none rounded-2xl px-5 bg-zinc-50 border border-zinc-200 text-zinc-900 focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20 outline-none text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer pr-10"
              {...register("department")}
            >
              <option value="general">{t("departmentOptions.general")}</option>
              <option value="sales">{t("departmentOptions.sales")}</option>
              <option value="dealership">{t("departmentOptions.dealership")}</option>
              <option value="support">{t("departmentOptions.support")}</option>
              <option value="media">{t("departmentOptions.media")}</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
          {errors.department?.message && (
            <p className="mt-1.5 text-xs text-red-500 font-semibold pl-1">
              {errors.department.message}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Input
            label={t("subjectLabel")}
            placeholder={t("subjectPlaceholder")}
            error={errors.subject?.message}
            disabled={isSubmitting}
            icon={<FileText className="w-4 h-4 text-zinc-400" />}
            {...register("subject")}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Textarea
            label={t("messageLabel")}
            placeholder={t("messagePlaceholder")}
            error={errors.message?.message}
            disabled={isSubmitting}
            rows={5}
            {...register("message")}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          className="pt-4"
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="brand"
            className="w-full sm:w-auto min-w-[200px] h-12 rounded-full font-bold text-xs uppercase tracking-widest px-8 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-green/20"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                {t("submit")}
              </>
            )}
          </Button>
        </motion.div>

        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 p-4 rounded-2xl text-xs font-semibold"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage || t("genericError")}</span>
          </motion.div>
        )}
      </motion.div>
    </form>
  );
};
