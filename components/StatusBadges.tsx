import { cn } from '@/lib/utils';
import type { VehicleStatus, ShipmentStatus, TaskStatus, TaskPriority, OnlineStatus } from '@/types';

const vehicleStatusStyles: Record<VehicleStatus, string> = {
  BOOKED: 'bg-sky-100 text-sky-700 border-sky-200',
  RESERVED: 'bg-amber-100 text-amber-700 border-amber-200',
  'PARTIAL PAID': 'bg-violet-100 text-violet-700 border-violet-200',
  AVAILABLE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  SHIPPED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const shipmentStatusStyles: Record<ShipmentStatus, string> = {
  SHIPPED: 'bg-sky-100 text-sky-700 border-sky-200',
  BOOKING: 'bg-amber-100 text-amber-700 border-amber-200',
  LOADED: 'bg-violet-100 text-violet-700 border-violet-200',
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const taskStatusStyles: Record<TaskStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  'IN PROGRESS': 'bg-sky-100 text-sky-700 border-sky-200',
  COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const priorityStyles: Record<TaskPriority, string> = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  NORMAL: 'bg-sky-100 text-sky-700 border-sky-200',
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  let cls = 'bg-slate-100 text-slate-700 border-slate-200';
  if (status in vehicleStatusStyles)
    cls = vehicleStatusStyles[status as VehicleStatus];
  else if (status in shipmentStatusStyles)
    cls = shipmentStatusStyles[status as ShipmentStatus];
  else if (status in taskStatusStyles)
    cls = taskStatusStyles[status as TaskStatus];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        cls,
        className
      )}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: TaskPriority;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        priorityStyles[priority],
        className
      )}
    >
      {priority}
    </span>
  );
}

export function StatusDot({
  status,
  className,
}: {
  status: OnlineStatus;
  className?: string;
}) {
  const colors: Record<OnlineStatus, string> = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
  };
  return (
    <span
      className={cn(
        'inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white',
        colors[status],
        className
      )}
    />
  );
}
