"use client";

import { useTranslations } from 'next-intl';
import { ModeCard } from "@/components/ModeCard";
import { 
  Calendar, 
  Dumbbell, 
  Boxes, 
  Layers,
  Trophy,
  MonitorPlay,
  ArrowLeft,
  Heart,
  Network,
  Box,
  Gamepad2,
  Cuboid,
  Wand2,
  PaintBucket
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { KofiButton } from "@/components/KofiButton";

export default function ModesHub() {
  const t = useTranslations('Hub');

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col p-6 sm:p-12 md:p-24 pb-32">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Boxes className="w-12 h-12 text-zinc-950 dark:text-zinc-50" />
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 drop-shadow-sm">
              {t('title')}
            </h1>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-medium">
            {t('description')}
          </p>
          <p className="text-sm text-zinc-950 dark:text-zinc-500 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* Main Modes */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              {t('featured')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/daily/classic" className="group flex-1">
                <div className="h-full px-6 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-emerald-400 font-bold text-lg mb-1">{t('play_classic')}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">{t('play_classic_desc')}</p>
                  </div>
                </div>
              </Link>
              <Link href="/practice" className="group flex-1">
                <div className="h-full px-6 py-4 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/50 hover:border-zinc-600 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="p-3 bg-zinc-700/50 rounded-full text-zinc-600 dark:text-zinc-400 group-hover:scale-110 transition-transform">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-zinc-700 dark:text-zinc-300 font-bold text-lg mb-1">{t('practice')}</h3>
                    <p className="text-zinc-950 dark:text-zinc-500 text-sm">{t('practice_desc')}</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Dificultad Competitiva */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t('tiers_title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ModeCard 
                title={t('tier1_title')}
                description={t('tier1_desc')}
                icon={Layers}
                href="/daily/tier1"
                colorClass="border-emerald-500/20 [&_svg]:text-emerald-400"
              />
              <ModeCard 
                title={t('tier2_title')}
                description={t('tier2_desc')}
                icon={Boxes}
                href="/daily/tier2"
                colorClass="border-sky-500/20 [&_svg]:text-sky-400"
              />
              <ModeCard 
                title={t('tier3_title')}
                description={t('tier3_desc')}
                icon={Network}
                href="/daily/tier3"
                colorClass="border-rose-500/20 [&_svg]:text-rose-400"
              />
            </div>
          </section>

          {/* Software Competitivo */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <MonitorPlay className="w-5 h-5 text-blue-400" />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t('software_title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ModeCard 
                title="Blender Daily" 
                description={t('blender_desc')}
                icon={Box}
                href="/daily/blender"
                colorClass="border-orange-500/20 [&_svg]:text-orange-400"
              />
              <ModeCard 
                title="Unreal Daily" 
                description={t('unreal_desc')}
                icon={Gamepad2}
                href="/daily/unreal"
                colorClass="border-indigo-500/20 [&_svg]:text-indigo-400"
              />
              <ModeCard 
                title="Unity Daily" 
                description={t('unity_desc')}
                icon={Cuboid}
                href="/daily/unity"
                colorClass="border-zinc-500/20 [&_svg]:text-zinc-600 dark:text-zinc-400"
              />
              <ModeCard 
                title="Houdini Daily" 
                description={t('houdini_desc')}
                icon={Wand2}
                href="/daily/houdini"
                colorClass="border-amber-500/20 [&_svg]:text-amber-400"
              />
              <ModeCard 
                title="Substance Daily" 
                description={t('substance_desc')}
                icon={PaintBucket}
                href="/daily/substance"
                colorClass="border-red-500/20 [&_svg]:text-red-400"
              />
            </div>
          </section>

          {/* Donation / Support Section */}
          <section className="flex flex-col items-center text-center mt-20 p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50">
            <Heart className="w-10 h-10 text-indigo-400 mb-4 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              {t('support_title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mb-8 leading-relaxed">
              {t('support_desc_1')} <br/><br/>
              {t('support_desc_2')}
            </p>
            <div className="scale-110">
              <KofiButton label="Apoyar el proyecto en Ko-fi" />
            </div>
          </section>
        </div>

        {/* Global Footer */}
        <footer className="mt-16 flex flex-col items-center justify-center gap-4 text-center border-t border-zinc-200 dark:border-zinc-800/50 pt-8 pb-8 w-full max-w-4xl">
          <p className="text-zinc-950 dark:text-zinc-500 text-sm">
            {t('footer_created')}
          </p>
          <p className="text-zinc-600 text-xs max-w-2xl px-4">
            {t('footer_legal')}
          </p>
        </footer>
      </div>
    </main>
  );
}
