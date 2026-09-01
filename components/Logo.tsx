import { cn } from '@/lib/utils';
import { Ship } from 'lucide-react';

export function Logo({
  className,
  iconClassName,
  showText = true,
  size = 'md',
}: {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dim = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const iconDim =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white shadow-sm',
          dim,
          iconClassName
        )}
      >
        <Ship className={iconDim} />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-bold tracking-tight text-foreground',
              size === 'lg' ? 'text-lg' : 'text-base'
            )}
          >
            ATJ Chat
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Afridi Trading Japan
          </span>
        </div>
      )}
    </div>
  );
}
