import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ADMIN_AUTH_CONSTANTS } from '@/lib/constants/auth';

/** The dark full-screen frame shared by the sign-in, forgot-password and set-password pages. */
export function AdminAuthShell({ children, hero }: { children: React.ReactNode; hero?: React.ReactNode }) {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white selection:bg-brand-green selection:text-white">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={ADMIN_AUTH_CONSTANTS.BACKGROUND_IMAGE_PATH}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-75 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 min-h-screen flex flex-col justify-between">
        <header className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-36">
              <Image
                src={ADMIN_AUTH_CONSTANTS.LOGO_IMAGE_PATH}
                alt="APSONIC"
                fill
                priority
                sizes="144px"
                className="object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
          {hero ?? <div className="hidden lg:block lg:col-span-7" />}
          {children}
        </div>
      </div>
    </main>
  );
}

/** The translucent card the forms sit in. */
export function AdminAuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:col-span-5 w-full max-w-md mx-auto lg:ml-auto">
      <div className="backdrop-blur-2xl bg-neutral-950/65 border border-white/15 shadow-2xl rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/15 rounded-full blur-3xl pointer-events-none" />
        {children}
      </div>
    </div>
  );
}
