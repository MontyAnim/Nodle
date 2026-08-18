import { NextResponse } from 'next/server';

const MODE_COLORS: Record<string, string> = {
  classic: '#34d399', // emerald-400
  tier1: '#34d399',   // emerald-400
  tier2: '#38bdf8',   // sky-400
  tier3: '#fb7185',   // rose-400
  blender: '#fb923c', // orange-400
  unreal: '#818cf8',  // indigo-400
  unity: '#52525b',   // zinc-600
  houdini: '#fbbf24', // amber-400
  substance: '#f87171' // red-400
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mode: string }> }
) {
  const { mode } = await params;
  const color = MODE_COLORS[mode] || '#34d399';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.76313 26.537967" width="100%" height="100%">
  <!-- Inner Node Circle -->
  <path style="display:inline;fill:${color};stroke-width:0.225616" d="m 19.443487,23.349464 a 3.1167803,3.0778205 0 0 0 3.11678,3.077821 3.1167803,3.0778205 0 0 0 3.11678,-3.077821 3.1167803,3.0778205 0 0 0 -3.11678,-3.07782 3.1167803,3.0778205 0 0 0 -3.11678,3.07782 z M 0.183284,3.257343 a 3.1167803,3.0778205 0 0 0 3.11678,3.077821 3.1167803,3.0778205 0 0 0 3.116781,-3.077821 3.1167803,3.0778205 0 0 0 -3.116781,-3.07782 3.1167803,3.0778205 0 0 0 -3.11678,3.07782 z" />
  <!-- Outer Node Ring -->
  <path style="display:inline;fill:none;stroke:${color};stroke-width:5" d="m 11.220721,2.5 h 3.321689 c 4.831279,0 8.720721,3.889441 8.720721,8.72072 v 4.096527 c 0,4.831279 -3.889442,8.72072 -8.720721,8.72072 H 11.220721 C 6.389442,24.037967 2.5,20.148526 2.5,15.317247 V 11.22072 C 2.5,6.389441 6.389442,2.5 11.220721,2.5 Z" />
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}
