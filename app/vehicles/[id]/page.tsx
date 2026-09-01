'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AppShell } from '@/components/AppShell';
import { RecordChat } from '@/components/chat/RecordChat';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Car,
  MapPin,
  FileText,
  Calendar,
  DollarSign,
  Palette,
  Container,
  MessageSquare,
  CheckSquare,
} from 'lucide-react';

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Car;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getVehicle, shipments, tasks } = useApp();
  const vehicle = getVehicle(id);
  const [tab, setTab] = useState('discussion');

  if (!vehicle) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <Car className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Vehicle not found</p>
          <Link href="/vehicles" className="text-sm text-primary hover:underline">
            Back to Vehicles
          </Link>
        </div>
      </AppShell>
    );
  }

  const linkedShipment = shipments.find((s) => s.vehicleIds.includes(vehicle.id));
  const linkedTasks = tasks.filter((t) => t.relatedVehicleId === vehicle.id);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
          <Link href="/vehicles">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-bold text-foreground">{vehicle.reference}</h1>
              <StatusBadge status={vehicle.status} />
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {vehicle.make} {vehicle.model} · {vehicle.chassis}
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Left: details */}
          <div className="w-full shrink-0 overflow-y-auto border-b border-border lg:w-[380px] lg:border-b-0 lg:border-r scrollbar-thin">
            <div className="p-4">
              <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-sky-100">
                <Car className="h-12 w-12 text-violet-400" />
              </div>
              <Card>
                <CardContent className="p-4">
                  <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    Vehicle Details
                  </h2>
                  <DetailRow icon={Car} label="Reference" value={vehicle.reference} />
                  <DetailRow icon={Car} label="Make" value={vehicle.make} />
                  <DetailRow icon={Car} label="Model" value={vehicle.model} />
                  <DetailRow icon={FileText} label="Chassis" value={vehicle.chassis} />
                  <DetailRow icon={Calendar} label="Year" value={vehicle.year} />
                  <DetailRow icon={Palette} label="Color" value={vehicle.color} />
                  <DetailRow icon={MapPin} label="Destination" value={vehicle.destination} />
                  <DetailRow icon={FileText} label="Booking" value={vehicle.booking} />
                  <DetailRow
                    icon={DollarSign}
                    label="Price"
                    value={`$${vehicle.price.toLocaleString()}`}
                  />
                </CardContent>
              </Card>

              {/* Linked records */}
              <div className="mt-4 space-y-3">
                {linkedShipment && (
                  <Link href={`/shipments/${linkedShipment.id}`}>
                    <Card className="transition-colors hover:border-primary/30">
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                          <Container className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Linked Shipment
                          </p>
                          <p className="truncate text-sm font-semibold text-foreground">
                            {linkedShipment.container}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {linkedShipment.destination} · ETA {linkedShipment.eta}
                          </p>
                        </div>
                        <StatusBadge status={linkedShipment.status} />
                      </CardContent>
                    </Card>
                  </Link>
                )}

                {linkedTasks.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        Linked Tasks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      {linkedTasks.map((t) => (
                        <div key={t.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{t.title}</p>
                            <p className="text-xs text-muted-foreground">Assigned to {t.assignedTo}</p>
                          </div>
                          <PriorityBadge priority={t.priority} />
                          <StatusBadge status={t.status} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Right: tabs (discussion / info) */}
          <div className="flex min-h-0 flex-1 flex-col">
            <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col">
              <div className="border-b border-border bg-card px-4 pt-3">
                <TabsList>
                  <TabsTrigger value="discussion" className="gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    Vehicle Discussion
                  </TabsTrigger>
                  <TabsTrigger value="info" className="gap-1.5">
                    <Car className="h-4 w-4" />
                    Info
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="discussion" className="mt-0 min-h-0 flex-1">
                <RecordChat recordId={vehicle.id} type="vehicle" title={vehicle.reference} />
              </TabsContent>
              <TabsContent value="info" className="mt-0 overflow-y-auto p-4 scrollbar-thin">
                <div className="mx-auto max-w-2xl space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        Connected Records
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This vehicle is connected to its shipment, booking, and discussion.
                        Staff never need to search WhatsApp to understand what happened to
                        <span className="font-semibold text-foreground"> {vehicle.reference}</span>.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
