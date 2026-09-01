'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadges';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Car, Search, MapPin, FileText } from 'lucide-react';

export default function VehiclesPage() {
  const { vehicles } = useApp();
  const [query, setQuery] = useState('');

  const filtered = vehicles.filter(
    (v) =>
      v.reference.toLowerCase().includes(query.toLowerCase()) ||
      v.chassis.toLowerCase().includes(query.toLowerCase()) ||
      v.make.toLowerCase().includes(query.toLowerCase()) ||
      v.model.toLowerCase().includes(query.toLowerCase()) ||
      v.destination.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Vehicles</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Every vehicle has its own communication history.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reference, chassis, model…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <Link key={v.id} href={`/vehicles/${v.id}`}>
                <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        <Car className="h-5 w-5" />
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{v.reference}</h3>
                    <p className="text-sm text-muted-foreground">
                      {v.make} {v.model} · {v.year}
                    </p>
                    <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Chassis</span>
                        <span className="font-medium text-foreground">{v.chassis}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" /> Destination
                        </span>
                        <span className="font-medium text-foreground">{v.destination}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="h-3 w-3" /> Booking
                        </span>
                        <span className="font-medium text-foreground">{v.booking}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Car className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No vehicles found</p>
              <p className="text-xs text-muted-foreground">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
