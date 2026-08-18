"use client";

import { useTranslations } from 'next-intl';
import Image from "next/image";
import { ModeCard } from "@/components/ModeCard";
import { NodleLogo } from "@/components/NodleLogo";
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
  PaintBucket,
  Smile,
  Meh,
  Angry
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { KofiButton } from "@/components/KofiButton";

const BlenderIcon = ({ className }: { className?: string }) => <svg viewBox="0.499 48.118 511.002 415.763" className={className} fill="currentColor"><path d="M510.003 279.642c-2.998-21.097-10.305-41.104-21.725-59.459-9.959-16.019-22.738-30.266-37.991-42.375l.041-.038L290.133 54.731a4.569 4.569 0 0 0-.361-.287c-5.326-4.08-12.537-6.325-20.297-6.325-7.77 0-15.263 2.25-21.088 6.338-6.263 4.375-9.843 10.18-10.093 16.359-.229 5.765 2.521 11.312 7.764 15.636 10.31 8.135 20.597 16.447 30.898 24.769 9.997 8.08 20.298 16.401 30.549 24.502l-196.213-.133c-22.439 0-37.718 10.537-40.861 28.178-1.381 7.727 1.056 16.223 6.504 22.73 5.78 6.898 14.172 10.703 23.629 10.703l14.958.01c20.664 0 41.419-.051 62.146-.101l19.766-.046-178.08 131.748-.707.517C8.7 336.953 2.188 347.642.783 358.653c-1.065 8.342.881 15.965 5.63 22.053 5.66 7.258 14.497 11.25 24.885 11.25 10.205 0 20.618-3.867 29.334-10.908l96.166-78.7c-.411 3.843-.91 9.481-.853 13.573.108 6.479 2.188 19.479 5.481 30.033 6.804 21.69 18.265 41.535 34.063 58.963 16.438 18.132 36.458 32.509 59.5 42.722 24.36 10.774 50.547 16.243 77.836 16.243h.253c27.376-.066 53.646-5.622 78.085-16.519 23.08-10.334 43.091-24.769 59.467-42.898 15.778-17.517 27.223-37.395 34.014-59.067a151.124 151.124 0 0 0 6.416-33.003c.839-10.83.478-21.85-1.057-32.753zM334.82 383.601c-60.141 0-108.911-43.627-108.911-97.447 0-53.814 48.771-97.441 108.911-97.441 60.142 0 108.907 43.627 108.907 97.441.002 53.82-48.765 97.447-108.907 97.447zm62.807-106.01c.887 16.063-5.529 30.978-16.796 42.019-11.461 11.248-27.815 18.313-46.103 18.313-18.28 0-34.637-7.065-46.102-18.313-11.262-11.041-17.665-25.954-16.783-42.006.864-15.603 8.475-29.376 19.939-39.128 11.273-9.589 26.41-15.439 42.945-15.439 16.537 0 31.67 5.852 42.944 15.439 11.47 9.752 19.083 23.515 19.956 39.115z"/></svg>;
const UnrealIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 210.4 210.4" className={className} fill="currentColor"><path d="M105.2 5c55.3 0 100.2 45 100.2 100.2s-45 100.2-100.2 100.2S5 160.5 5 105.2 50 5 105.2 5m0-5C47.1 0 0 47.1 0 105.2s47.1 105.2 105.2 105.2 105.2-47.1 105.2-105.2S163.4 0 105.2 0z"/><path d="M97.9 42.2s-23.7 6.7-45 29.3-24 38.7-24 50.7c4.7-8 33.7-52.1 40.5-31.1v50.2s-.4 6.8-10.8 4.1c3.1 5.8 19.1 20.1 48 23 6.6-6.6 15.2-16.1 15.2-16.1l14.4 12.2s25.9-16.8 36.1-41.2c-9.5 6.2-21 20.6-27 10.5V72.7s15.4-23.1 17.8-24.2c-6.1 1.1-27.6 8.2-38.9 22.8-3.2-3.5-12.1-3.6-12.1-3.6s7 5.8 7.1 11.1 0 49.5 0 54.6c-4.8 4.9-9.9 7.5-13.2 7.5-7.7 0-9.9-2.7-12-5.4V71.3s-3.8 3.2-6.8-2S84.1 54 97.9 42.2z"/></svg>;
const UnityIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 128 128" className={className} fill="currentColor"><path d="M59.049 0 7.339 29.855V89.56l19.825-11.45V54.714c.009-.402.225-.771.573-.967a1.13 1.13 0 0 1 1.129-.008l24.087 13.9a2.275 2.275 0 0 1 1.133 1.97v27.8a1.156 1.156 0 0 1-.565.98 1.131 1.131 0 0 1-1.124.012l-20.27-11.718-19.832 11.46L63.991 128l51.702-29.856-19.817-11.46-20.261 11.703a1.151 1.151 0 0 1-1.124-.008 1.145 1.145 0 0 1-.568-.976V69.608c0-.82.424-1.56 1.133-1.968L99.13 53.737a1.119 1.119 0 0 1 1.124.008c.352.196.572.565.575.967v23.396l19.83 11.454V29.855h-.009L68.96 0v22.9l20.26 11.696c.347.204.555.577.555.984 0 .403-.212.773-.555.976L65.137 50.468a2.302 2.302 0 0 1-2.27 0L38.791 36.556a1.122 1.122 0 0 1-.56-.976 1.127 1.127 0 0 1 .56-.984L59.048 22.9zm0 0"/></svg>;
const HoudiniIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 512 512" className={className} fill="currentColor"><path d="M337.67,280.711c-10.697-51.427-63.512-112.321-121.879-125.632 c-60.695-13.709-101.315-14.091-148.968,17.947c-13.996,9.391-37.495,25.468-59.466,49.439v79.753 c30.949-67.06,101.497-123.241,180.483-102.953c134.152,34.364,112.666,128.894,96.546,167.245 c-28.933,68.965-135.302,98.726-168.025,32.845c-35.571-71.623,43.787-83.354,43.787-83.354s-20.642,20.069,5.244,46.509 c17.938,18.445,52.071,1.715,63.925-30.653c10.412-28.25-11.99-67.419-61.044-71.66c-41.083-3.615-102.731,27.568-109.005,90.255 c-5.934,59.356,20.596,83.954,59.116,110.176c38.406,26.212,120.655,36.057,167.603-9.972 C337.043,400.681,351.979,349.399,337.67,280.711z M7.357,0.5v156.503c23.44-20.732,42.984-31.116,43.787-31.611 c85.551-49.63,160.962-25.042,205.312-10.987c70.054,22.125,125.101,77.24,148.869,133.911 c27.682,65.952,3.732,191.97-89.707,255.636c-4.082,2.776-8.174,5.145-12.268,7.549h201.293V0.5H7.357z M7.357,427.646v60.31 c3.108,2.559,6.184,4.809,9.178,6.614c-2.758-1.134-5.875-2.645-9.178-4.445V511.5h87.516c-6.465-3.502-12.421-7.086-17.621-10.625 C51.575,483.31,24.165,458.458,7.357,427.646z"/></svg>;
const SubstanceIcon = ({ className }: { className?: string }) => <svg viewBox="7.3 7.7 174.1 143.4" className={className} fill="currentColor"><path d="m177.6 91.5h-27.1v-44.9c0-4.3-3.5-7.8-7.8-7.8h-44.9v-27.1c.2-1.9-1.2-3.6-3-3.8-1.9-.2-3.6 1.2-3.8 3v27.8h-45c-4.3 0-7.8 3.5-7.8 7.8v45h-26.9c-1.9-.2-3.6 1.2-3.8 3-.2 1.9 1.2 3.6 3 3.8h27.6v45c0 4.3 3.5 7.8 7.8 7.8h96.8c4.3 0 7.8-3.5 7.8-7.8v-45h27.1c2 .1 3.7-1.4 3.8-3.4 0-1.9-1.8-3.4-3.8-3.4zm-121.1-18.6 37.9-21.9 37.9 21.9v19.8l-17.4-5.6v-4.1l-20.6-11.8-14.9 8.7 52.8 16.9v19.8l-37.8 21.9-37.8-21.9v-19.8l17.5 5.5v4.1l20.4 11.8 15.2-8.8-53.2-16.8z"/></svg>;

export default function ModesHub() {
  const t = useTranslations('Hub');

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col p-6 sm:p-12 md:p-24 pb-32">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12 text-center flex flex-col items-center mt-12 sm:mt-4 md:mt-0">
          <div className="flex items-center justify-center mb-8">
            <h1 className="sr-only">{t('title')}</h1>
            <NodleLogo className="w-64 sm:w-80 md:w-96 drop-shadow-sm" />
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
              {t('featured')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/daily/classic" className="group flex-1">
                <div className="h-full px-6 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <div 
                      className="w-6 h-6 bg-current" 
                      style={{ 
                        WebkitMaskImage: 'url(/Node1.svg)', 
                        maskImage: 'url(/Node1.svg)',
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center'
                      }} 
                    />
                  </div>
                  <div>
                    <h3 className="text-emerald-400 font-bold text-lg mb-1">{t('play_classic')}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">{t('play_classic_desc')}</p>
                  </div>
                </div>
              </Link>
              <Link href="/practice" className="group flex-1">
                <div className="h-full px-6 py-4 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/50 hover:border-zinc-600 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center">
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
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t('tiers_title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ModeCard 
                title={t('tier1_title')}
                description={t('tier1_desc')}
                icon={Smile}
                href="/daily/tier1"
                colorClass="border-emerald-500/20 [&_svg]:text-emerald-400"
              />
              <ModeCard 
                title={t('tier2_title')}
                description={t('tier2_desc')}
                icon={Meh}
                href="/daily/tier2"
                colorClass="border-sky-500/20 [&_svg]:text-sky-400"
              />
              <ModeCard 
                title={t('tier3_title')}
                description={t('tier3_desc')}
                icon={Angry}
                href="/daily/tier3"
                colorClass="border-rose-500/20 [&_svg]:text-rose-400"
              />
            </div>
          </section>

          {/* Software Competitivo */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t('software_title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ModeCard 
                title="Blender Daily" 
                description={t('blender_desc')}
                icon={BlenderIcon}
                href="/daily/blender"
                colorClass="border-orange-500/20 [&_svg]:text-orange-400"
              />
              <ModeCard 
                title="Unreal Daily" 
                description={t('unreal_desc')}
                icon={UnrealIcon}
                href="/daily/unreal"
                colorClass="border-indigo-500/20 [&_svg]:text-indigo-400"
              />
              <ModeCard 
                title="Unity Daily" 
                description={t('unity_desc')}
                icon={UnityIcon}
                href="/daily/unity"
                colorClass="border-zinc-500/20 [&_svg]:text-zinc-600 dark:text-zinc-400"
              />
              <ModeCard 
                title="Houdini Daily" 
                description={t('houdini_desc')}
                icon={HoudiniIcon}
                href="/daily/houdini"
                colorClass="border-amber-500/20 [&_svg]:text-amber-400"
              />
              <ModeCard 
                title="Substance Daily" 
                description={t('substance_desc')}
                icon={SubstanceIcon}
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
              <KofiButton />
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
