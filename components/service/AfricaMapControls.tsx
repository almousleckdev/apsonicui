'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AfricaMapFallbackProps {
  error: string | null;
  selectedCountry?: string;
  onCountrySelect?: (countryCode: string) => void;
  className?: string;
}

const COVERED_COUNTRIES = [
  { name: 'Ghana (加纳)', code: 'Ghana', flag: '🇬🇭' },
  { name: 'Togo (多哥)', code: 'Togo', flag: '🇹🇬' },
  { name: 'Benin (贝宁)', code: 'Benin', flag: '🇧🇯' },
  { name: 'Mali (马里)', code: 'Mali', flag: '🇲🇱' },
];

export const AfricaMapFallback: React.FC<AfricaMapFallbackProps> = ({
  error,
  selectedCountry,
  onCountrySelect,
  className,
}) => {
  return (
    <div className={cn('relative w-full h-full bg-[#181818] overflow-hidden flex flex-col md:flex-row items-stretch font-sans', className)}>
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-brand-green blur-[80px]" />
        <div className="absolute bottom-[10%] right-[40%] w-[250px] h-[250px] rounded-full bg-brand-green blur-[100px]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center md:pl-[680px] p-6 text-center text-white">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-6 shadow-lg animate-pulse">
            <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-8.25V15m-9 3.75h.008v.008H6v-.008zm.008 0H6V18h.008v-.008zm0 0H6v-.008H5.992v.008zm0 0h.008V18H6v-.008zm0 0H6v.008h-.008V18zm0 0H6V18h.008v-.008zm0 0H6V18h.008v-.008zm0 0h-.008v-.008H5.992v.008zm0 0h.008v.008H6v-.008zM15 18h.008v.008H15V18zm.008 0H15V18h.008v-.008zm0 0H15v-.008h-.008v.008zm0 0h.008V18H15v-.008zm0 0H15v.008h-.008V18zm0 0H15V18h.008v-.008zm0 0H15V18h.008v-.008zm0 0h-.008v-.008h-.008v.008zm0 0h.008v.008H15V18zm-6 0h.008v.008H9V18zm.008 0H9V18h.008v-.008zm0 0H9v-.008H8.992v.008zm0 0h.008V18H9v-.008zm0 0H9v.008h-.008V18zm0 0H9V18h.008v-.008zm0 0H9V18h.008v-.008zm0 0h-.008v-.008H8.992v.008zm0 0h.008v.008H9v-.008zM12 3.75v.008H12V3.75zm.008 0H12V3.75h.008v-.008zm0 0H12v-.008h-.008v.008zm0 0h.008V3.75H12v-.008zm0 0H12v.008h-.008V3.75zm0 0H12V3.75h.008v-.008zm0 0H12V3.75h.008v-.008zm0 0h-.008v-.008h-.008v.008zm0 0h.008v.008H12v-.008zM12 20.25V21m0-17.25v.008H12V3.75zm0 0v16.5m0-16.5H9.75M12 3.75h2.25m-2.25 16.5H9.75m2.25 0h2.25m-2.25-16.5v16.5m0-16.5L9.75 6.75m2.25-3L14.25 6.75M12 20.25l-2.25-3.75m2.25 3.75l2.25-3.75M9.75 6.75V16.5M14.25 6.75V16.5M9.75 6.75L6 9.75m8.25-3l3.75 3m-12 0v7.5m8.25-7.5v7.5m-8.25 0l-3.75 3.75m12-3.75l3.75 3.75M2.25 13.5h19.5" />
            </svg>
          </div>

          <h3 className="text-xl font-bold mb-2 tracking-tight text-white">
            服务地图已切换为简化版
          </h3>
          
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            {error?.includes('not set') ? (
              <>
                因未检测到 <code className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-brand-green font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> 环境变量，系统已自动加载备用交互界面。
              </>
            ) : (
              <>
                <code className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-brand-green font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> 无效或格式不正确，系统已自动加载备用交互界面。
              </>
            )}
          </p>

          <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-6 shadow-inner">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
              选择 Apsonic 覆盖国家
            </span>
            
            <div className="grid grid-cols-2 gap-2">
              {COVERED_COUNTRIES.map((country) => {
                const isSelected = selectedCountry?.toLowerCase() === country.code.toLowerCase();
                return (
                  <button
                    key={country.code}
                    onClick={() => {
                      if (onCountrySelect) {
                        if (isSelected) {
                          onCountrySelect('');
                        } else {
                          onCountrySelect(country.code);
                        }
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'bg-red-600 border-transparent text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] scale-[1.02]'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10'
                    )}
                  >
                    <span>{country.flag}</span>
                    <span className="truncate">{country.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-gray-500 leading-normal">
            提示：若要启用包含缩放、定位及精确路线规划的完整 3D 渲染地图，请在 <code className="text-gray-400">.env.local</code> 中配置您的 Mapbox 公钥并重启服务。
          </div>
        </div>
      </div>
    </div>
  );
};
