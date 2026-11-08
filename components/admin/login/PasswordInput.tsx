'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from '@/components/ui/input';
import { useAdminText } from '@/context/AdminTextContext';

/** A dark password field with a button that shows or hides what was typed. Labels are in Chinese. */
export const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'icon' | 'trailing' | 'variant'>>(
  function PasswordInput(props, ref) {
    const { parts } = useAdminText();
    const [visible, setVisible] = useState(false);

    return (
      <Input
        {...props}
        ref={ref}
        type={visible ? 'text' : 'password'}
        icon={<Lock className="w-5 h-5" />}
        variant="dark"
        trailing={
          <button
            type="button"
            onClick={() => setVisible((shown) => !shown)}
            aria-label={parts(visible ? 'login.hidePassword' : 'login.showPassword').zh}
            aria-pressed={visible}
            className="p-2 text-white/60 hover:text-white transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60"
          >
            {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
      />
    );
  }
);
