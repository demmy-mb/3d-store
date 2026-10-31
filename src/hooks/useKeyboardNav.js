import { useEffect, useRef } from 'react';

/**
 * Left / Right arrows step through items, Escape closes the open panel.
 * Handlers are read from a ref so callers can pass inline functions.
 */
export default function useKeyboardNav({ onPrev, onNext, onEscape }) {
  const handlersRef = useRef({ onPrev, onNext, onEscape });
  useEffect(() => {
    handlersRef.current = { onPrev, onNext, onEscape };
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable]')) return;
      const { onPrev, onNext, onEscape } = handlersRef.current;
      if (e.key === 'ArrowLeft' && onPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext) {
        e.preventDefault();
        onNext();
      } else if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
