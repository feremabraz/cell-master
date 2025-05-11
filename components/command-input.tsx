'use client';

import type React from 'react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { isLoadingAtom } from '@/store/game-store';

interface CommandInputProps {
  onSubmitCommand: (command: string) => void;
}

export function CommandInput({ onSubmitCommand }: CommandInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = useAtomValue(isLoadingAtom);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputRef.current || !inputRef.current.value.trim() || isLoading) return;

    const command = inputRef.current.value.toLowerCase();
    inputRef.current.value = '';

    // Call the onSubmitCommand prop with the command
    onSubmitCommand(command);
  };

  return (
    <form onSubmit={handleCommand} className="flex gap-2">
      <div className="flex items-center text-green-500 font-mono">
        <ChevronRight className="h-5 w-5" />
      </div>
      <Input
        ref={inputRef}
        className="flex-1 bg-black text-green-500 border-green-500 border-2 rounded-none font-mono h-10 placeholder:text-gray-300"
        placeholder="Enter command (type 'help' for commands)"
        disabled={isLoading}
      />
      <Button
        type="submit"
        className="bg-green-700 hover:bg-green-600 text-white border-2 border-green-500 rounded-none h-10 px-6 py-2 font-mono font-normal tracking-widest min-w-20"
        disabled={isLoading}
      >
        {isLoading ? '...' : 'Submit'}
      </Button>
    </form>
  );
}
