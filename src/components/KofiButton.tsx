import React from 'react';
import { Coffee } from 'lucide-react';

interface KofiButtonProps {
  label?: string;
  className?: string;
}

export function KofiButton({ label = "Apoyar en Ko-fi", className = "" }: KofiButtonProps) {
  // Replace this with the actual Ko-fi username/URL
  const KOFI_URL = "https://ko-fi.com/montyanim"; 

  return (
    <a
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-4 py-2 bg-[#29abe0]/10 hover:bg-[#29abe0]/20 border border-[#29abe0]/30 hover:border-[#29abe0]/60 text-[#29abe0] rounded-full text-sm font-medium transition-all ${className}`}
    >
      <Coffee className="w-4 h-4" />
      {label}
    </a>
  );
}
