"use client";

import { useTranslations } from "next-intl";
import { useContactForm } from "@/hooks/forms/useContactForm";
import { CountryPicker } from "./CountryPicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Send, User, Mail, Phone, FileText, ChevronDown, Loader2 } from "lucide-react";

export const ContactForm = () => {
  const t = useTranslations("contact.form");
  const {
    register,
    errors,
    selectedCountry,
    handleCountryChange,
    isSubmitting,
    submitStatus,
    errorMessage,
    onSubmit,
    resetStatus,
  } = useContactForm();

  if (submitStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center p-8 sm:p-14 bg-white rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-200/40"
      >
        <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mb-5">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h3 className="text-2xl font-black text-zinc-950 mb-2 uppercase tracking-wide">
          {t("successTitle")}
        </h3>
        <p className="text-zinc-500 leading-relaxed text-sm mb-8 max-w-sm font-medium">
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
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* 1. First Name, Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label={t("firstNameLabel")}
          placeholder={t("firstNamePlaceholder")}
          error={errors.firstName?.message}
          disabled={isSubmitting}
          icon={<User className="w-4 h-4 text-zinc-400" />}
          {...register("firstName")}
        />
        <Input
          label={t("lastNameLabel")}
          placeholder={t("lastNamePlaceholder")}
          error={errors.lastName?.message}
          disabled={isSubmitting}
          icon={<User className="w-4 h-4 text-zinc-400" />}
          {...register("lastName")}
        />
      </div>

      {/* 2. Email */}
      <div>
        <Input
          type="email"
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          error={errors.email?.message}
          disabled={isSubmitting}
          icon={<Mail className="w-4 h-4 text-zinc-400" />}
          {...register("email")}
        />
      </div>

      {/* 3. Country, Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CountryPicker
          selectedCountryCode={selectedCountry.code}
          onSelectCountry={handleCountryChange}
          disabled={isSubmitting}
          error={errors.country?.message}
        />
        <Input
          type="tel"
          label="Phone Number"
          placeholder={`${selectedCountry.dialCode} ...`}
          error={errors.phone?.message}
          disabled={isSubmitting}
          icon={<Phone className="w-4 h-4 text-zinc-400" />}
          {...register("phone")}
        />
      </div>

      {/* 4. Department */}
      <div className="w-full">
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
          <p className="mt-1.5 text-xs text-red-500 font-semibold pl-1">{errors.department.message}</p>
        )}
      </div>

      {/* 5. Subject */}
      <div>
        <Input
          label={t("subjectLabel")}
          placeholder={t("subjectPlaceholder")}
          error={errors.subject?.message}
          disabled={isSubmitting}
          icon={<FileText className="w-4 h-4 text-zinc-400" />}
          {...register("subject")}
        />
      </div>

      {/* 6. Message */}
      <div>
        <Textarea
          label={t("messageLabel")}
          placeholder={t("messagePlaceholder")}
          error={errors.message?.message}
          disabled={isSubmitting}
          rows={5}
          {...register("message")}
        />
      </div>

      {/* Submit Loading Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="brand"
          className="w-full sm:w-auto min-w-[220px] h-13 rounded-full font-bold text-xs uppercase tracking-widest px-8 flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-brand-green/25 transition-all active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t("submit")}</span>
            </>
          )}
        </Button>
      </div>

      {submitStatus === "error" && (
        <div className="flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 p-4 rounded-2xl text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage || t("genericError")}</span>
        </div>
      )}
    </form>
  );
};
