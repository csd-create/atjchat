'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadges';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Container, Search, MapPin, Calendar, Car } from 'lucide-react';

export default function ShipmentsPage() {
  const { shipments, getVehicle } = useApp();
  const [query, setQuery] = useState('');

  const filtered = shipments.filter(
    (s) =>
      s.container.toLowerCase().includes(query.toLowerCase()) ||
      s.destination.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Shipments</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Every shipment has its own discussion thread.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search container, destination…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <Link key={s.id} href={`/shipments/${s.id}`}>
                <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Container className="h-5 w-5" />
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{s.container}</h3>
                    <p className="text-sm text-muted-foreground">{s.destination}</p>
                    <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" /> ETD
                        </span>
                        <span className="font-medium text-foreground">{s.etd}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" /> ETA
                        </span>
                        <span className="font-medium text-foreground">{s.eta}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Car className="h-3 w-3" /> Vehicles
                        </span>
                        <span className="font-medium text-foreground">{s.vehicleIds.length} units</span>
                      </div>
                    </div>
                    {s.vehicleIds.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {s.vehicleIds.slice(0, 4).map((vid) => {
                          const v = getVehicle(vid);
                          return v ? (
                            <span
                              key={vid}
                              className="rounded-md bg-secondary px-2 py-1 text-[11px] font-medium text-foreground"
                            >
                              {v.reference}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Container className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No shipments found</p>
              <p className="text-xs text-muted-foreground">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
