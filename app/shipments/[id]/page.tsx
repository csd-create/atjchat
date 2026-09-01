'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { RecordChat } from '@/components/chat/RecordChat';
import { StatusBadge } from '@/components/StatusBadges';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Container,
  MapPin,
  Calendar,
  Car,
  MessageSquare,
} from 'lucide-react';

export default function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getShipment, getVehicle } = useApp();
  const shipment = getShipment(id);
  const [tab, setTab] = useState('discussion');

  if (!shipment) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <Container className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Shipment not found</p>
          <Link href="/shipments" className="text-sm text-primary hover:underline">
            Back to Shipments
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
          <Link href="/shipments">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-bold text-foreground">{shipment.container}</h1>
              <StatusBadge status={shipment.status} />
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {shipment.destination} · {shipment.vehicleIds.length} vehicles
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Left: details */}
          <div className="w-full shrink-0 overflow-y-auto border-b border-border lg:w-[380px] lg:border-b-0 lg:border-r scrollbar-thin">
            <div className="p-4">
              <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-sky-100">
                <Container className="h-12 w-12 text-amber-400" />
              </div>
              <Card>
                <CardContent className="p-4">
                  <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    Shipment Details
                  </h2>
                  <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Container className="h-4 w-4" /> Container
                    </span>
                    <span className="text-sm font-semibold text-foreground">{shipment.container}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> Destination
                    </span>
                    <span className="text-sm font-semibold text-foreground">{shipment.destination}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" /> ETD
                    </span>
                    <span className="text-sm font-semibold text-foreground">{shipment.etd}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" /> ETA
                    </span>
                    <span className="text-sm font-semibold text-foreground">{shipment.eta}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 last:border-0">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Car className="h-4 w-4" /> Vehicles
                    </span>
                    <span className="text-sm font-semibold text-foreground">{shipment.vehicleIds.length} units</span>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicles in this shipment */}
              <h3 className="mb-2 mt-4 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Vehicles in this shipment
              </h3>
              <div className="space-y-2">
                {shipment.vehicleIds.map((vid) => {
                  const v = getVehicle(vid);
                  if (!v) return null;
                  return (
                    <Link key={vid} href={`/vehicles/${v.id}`}>
                      <Card className="cursor-pointer transition-colors hover:border-primary/30">
                        <CardContent className="flex items-center gap-3 p-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                            <Car className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">{v.reference}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {v.make} {v.model}
                            </p>
                          </div>
                          <StatusBadge status={v.status} />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: tabs */}
          <div className="flex min-h-0 flex-1 flex-col">
            <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col">
              <div className="border-b border-border bg-card px-4 pt-3">
                <TabsList>
                  <TabsTrigger value="discussion" className="gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    Shipment Discussion
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="discussion" className="mt-0 min-h-0 flex-1">
                <RecordChat recordId={shipment.id} type="shipment" title={shipment.container} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
