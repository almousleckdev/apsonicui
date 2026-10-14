import Link from 'next/link';
import { Home, Search, Layers, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col items-center justify-center p-6 text-zinc-900 font-sans relative overflow-hidden">
      {/* Decorative Brand Gradient Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8 bg-white/90 backdrop-blur-md p-8 sm:p-12 rounded-[2.5rem] border border-zinc-200/80 shadow-2xl shadow-zinc-200/40">
        {/* Brand Logo & Status Tag */}
        <div className="flex items-center justify-center gap-3">
          <BrandLogo size={36} />
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-brand-green border border-emerald-100 text-[11px] font-extrabold uppercase tracking-wider">
            404 • Page Not Found
          </span>
        </div>

        {/* 404 Large Display */}
        <div className="space-y-3">
          <div className="relative inline-block">
            <span className="text-8xl sm:text-9xl font-black tracking-tighter text-zinc-900 select-none">
              4<span className="text-brand-green">0</span>4
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            Lost on the road?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed font-medium">
            The page or model you are looking for has been moved, renamed, or is currently unavailable in the APSONIC catalog.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-brand-green hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-brand-green/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-zinc-500" />
            <span>Explore Motorcycles</span>
          </Link>
        </div>

        {/* Helpful navigation suggestions */}
        <div className="pt-6 border-t border-zinc-100 text-[11px] text-zinc-400 font-medium flex items-center justify-center gap-6">
          <Link href="/services" className="hover:text-brand-green transition-colors">
            Services & Support
          </Link>
          <span>•</span>
          <Link href="/news" className="hover:text-brand-green transition-colors">
            Latest News
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-brand-green transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
