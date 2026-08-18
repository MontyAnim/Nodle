import React, { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useTranslations } from 'next-intl';
import { NodeData } from '@/types/node';
import { getHardModeConstraints, filterNodesByHardMode } from '@/lib/hardmode';

interface SearchBarProps {
  nodes: NodeData[];
  target: NodeData | null;
  onAttempt: (nodeId: string) => void;
  attempts: string[];
  hardMode?: boolean;
  disabled?: boolean;
}

export function SearchBar({ nodes, target, onAttempt, attempts, hardMode = false, disabled = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Game');
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Aplicar restricciones de Hard Mode
  const filteredNodes = useMemo(() => {
    if (!hardMode || !target || attempts.length === 0) return nodes;
    
    // Obtenemos los objetos NodeData completos de los intentos a partir de los IDs
    const attemptNodes = attempts
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is NodeData => n !== undefined);
      
    const constraints = getHardModeConstraints(attemptNodes, target);
    return filterNodesByHardMode(nodes, constraints);
  }, [nodes, target, attempts, hardMode]);

  // Inicializar Fuse.js con la lista (filtrada o completa)
  const fuse = useMemo(() => {
    return new Fuse(filteredNodes, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'aliases', weight: 0.3 }
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }, [filteredNodes]);

  // Obtener resultados
  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).slice(0, 10).map(result => result.item);
  }, [query, fuse]);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (node: NodeData) => {
    if (disabled) return;
    setQuery('');
    setIsOpen(false);
    onAttempt(node.id);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={t('search_placeholder')}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-950 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {results.map((node, index) => (
            <li
              key={`${node.id}-${index}`}
              onClick={() => handleSelect(node)}
              className="px-4 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/50 last:border-0 transition-colors"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{node.name}</span>
              <span className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <span className="text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                {node.software}
                </span>
                <span className="text-xs text-zinc-950 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700/50">
                  {node.context}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
      
      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-xl px-4 py-3 text-sm text-zinc-950 dark:text-zinc-500 text-center">
          {t('search_no_results')}
        </div>
      )}
    </div>
  );
}
