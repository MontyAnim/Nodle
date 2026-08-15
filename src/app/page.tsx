import { ModeCard } from "@/components/ModeCard";
import { 
  Calendar, 
  Dumbbell, 
  Boxes, 
  Layers, 
  Trophy, 
  MonitorPlay,
  ArrowLeft,
  Heart
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { KofiButton } from "@/components/KofiButton";

export default function ModesHub() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col p-6 sm:p-12 md:p-24 pb-32">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Boxes className="w-12 h-12 text-zinc-50" />
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-50">
              Nodle
            </h1>
          </div>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-4">
            El juego de deducción lógica basado en nodos para artistas técnicos y desarrolladores de videojuegos.
          </p>
          <p className="text-sm text-zinc-500 max-w-2xl mx-auto">
            Elige tu desafío. Compite en los retos diarios con otros artistas o practica a tu propio ritmo.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* Main Modes */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModeCard 
                title="Reto Diario Clásico" 
                description="El modo original. Un nodo aleatorio al día del pool completo. Compite en el Leaderboard global."
                icon={Calendar}
                href="/daily/classic"
                colorClass="border-amber-500/20 [&_svg]:text-amber-400"
              />
              <ModeCard 
                title="Práctica Libre" 
                description="Juega sin límites de tiempo. Configura la dificultad y el software para entrenar a tu propio ritmo."
                icon={Dumbbell}
                href="/practice"
                colorClass="border-violet-500/20 [&_svg]:text-violet-400"
              />
            </div>
          </section>

          {/* Dificultad Competitiva */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-500" />
              Retos por Nivel
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <ModeCard 
                title="Tier 1: Esenciales" 
                description="Solo nodos de uso muy frecuente (ej. Math, Multiply, Texture Coordinate). Ideal para principiantes."
                icon={Layers}
                href="/modes/tier1"
                colorClass="border-emerald-500/20 [&_svg]:text-emerald-400"
                disabled
                comingSoon
              />
              <ModeCard 
                title="Tier 2: Avanzados" 
                description="Nodos técnicos o matemáticos de uso específico (ej. Dot Product, Cross Product)."
                icon={Layers}
                href="/modes/tier2"
                colorClass="border-amber-500/20 [&_svg]:text-amber-400"
                disabled
                comingSoon
              />
              <ModeCard 
                title="Tier 3: Expertos" 
                description="Nodos oscuros, misceláneos o de uso muy de nicho. El desafío definitivo."
                icon={Layers}
                href="/modes/tier3"
                colorClass="border-red-500/20 [&_svg]:text-red-400"
                disabled
                comingSoon
              />
            </div>
          </section>

          {/* Software Competitivo */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center gap-2">
              <MonitorPlay className="w-6 h-6 text-blue-500" />
              Retos por Software
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ModeCard 
                title="Blender Daily" 
                description="Un nodo diario exclusivo del ecosistema de Blender (Shader y Geometry Nodes)."
                icon={Boxes}
                href="/modes/blender"
                colorClass="border-orange-500/20 [&_svg]:text-orange-400"
                disabled
                comingSoon
              />
              <ModeCard 
                title="Unreal Daily" 
                description="Un nodo diario del sistema de Blueprints o Material Expressions de UE5."
                icon={Boxes}
                href="/modes/unreal"
                colorClass="border-zinc-300/20 [&_svg]:text-zinc-200"
                disabled
                comingSoon
              />
              <ModeCard 
                title="Unity Daily" 
                description="Reto diario enfocado en Unity Shader Graph y Visual Scripting."
                icon={Boxes}
                href="/modes/unity"
                colorClass="border-zinc-300/20 [&_svg]:text-zinc-400"
                disabled
                comingSoon
              />
              <ModeCard 
                title="Procedural Daily" 
                description="Reto enfocado en Houdini VOPs/SOPs y Substance Designer."
                icon={Boxes}
                href="/modes/procedural"
                colorClass="border-yellow-500/20 [&_svg]:text-yellow-400"
                disabled
                comingSoon
              />
            </div>
          </section>

          {/* Donation / Support Section */}
          <section className="mt-8 relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 sm:p-10 text-center flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
            
            <Heart className="w-10 h-10 text-indigo-400 mb-4 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-4">
              Mantén vivo a Nodle
            </h2>
            <p className="text-zinc-400 max-w-2xl mb-8 leading-relaxed">
              Nodle es un proyecto creado con cariño para la comunidad técnica, sin publicidad invasiva ni muros de pago. Sin embargo, los costos de los servidores, las bases de datos en tiempo real para el Leaderboard y el hosting crecen con cada nuevo jugador. <br/><br/>
              Si disfrutas el juego, por favor considera invitarnos un café. ¡Toda ayuda es inmensamente agradecida y nos permite seguir creando más retos!
            </p>
            <div className="scale-110">
              <KofiButton label="Apoyar el proyecto en Ko-fi" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
