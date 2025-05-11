'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { isLoadingAtom } from '@/store/game-store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';

interface CommandInputProps {
  onSubmitCommand: (command: string) => void;
}

// Define the command schema with Zod
const commandSchema = z.object({
  command: z.string().min(1, { message: 'Command cannot be empty' }),
});

type CommandFormValues = z.infer<typeof commandSchema>;

export function CommandInput({ onSubmitCommand }: CommandInputProps) {
  const isLoading = useAtomValue(isLoadingAtom);

  // Initialize React Hook Form with Zod validation
  const form = useForm<CommandFormValues>({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      command: '',
    },
  });

  const handleCommand = async (values: CommandFormValues) => {
    if (isLoading) return;
    
    const command = values.command.toLowerCase().trim();
    
    // Call the onSubmitCommand prop with the command
    onSubmitCommand(command);
    
    // Reset the form after submission
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCommand)} className="flex gap-2">
        <div className="flex items-center text-green-500 font-mono">
          <ChevronRight className="h-5 w-5" />
        </div>
        <FormField
          control={form.control}
          name="command"
          render={({ field }) => (
            <FormItem className="flex-1 m-0">
              <FormControl>
                <Input
                  {...field}
                  className="flex-1 bg-black text-green-500 border-green-500 border-2 rounded-none font-mono h-10 placeholder:text-gray-300"
                  placeholder="Enter command (type 'help' for commands)"
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-green-700 hover:bg-green-600 text-white border-2 border-green-500 rounded-none h-10 px-6 py-2 font-mono font-normal tracking-widest min-w-20"
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
