'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Ship,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  Users,
  Car,
  Container,
} from 'lucide-react';
import type { User } from '@/types';

const demoAccounts: { label: string; email: string; roleLabel: string; color: string }[] = [
  { label: 'Raheel Hayat', email: 'raheel@atj.com', roleLabel: 'Operations Executive', color: 'bg-emerald-500' },
  { label: 'Japan Manager', email: 'japan@atj.com', roleLabel: 'Manager', color: 'bg-sky-500' },
  { label: 'Sales Team', email: 'sales@atj.com', roleLabel: 'Sales Executive', color: 'bg-violet-500' },
  { label: 'Shipping Team', email: 'shipping@atj.com', roleLabel: 'Shipping Executive', color: 'bg-amber-500' },
  { label: 'Management', email: 'admin@atj.com', roleLabel: 'Administrator', color: 'bg-rose-500' },
];

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      toast({ title: 'Welcome to ATJ Chat', description: 'Logged in successfully.' });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: 'Use a demo account below. Password is “demo”.',
        variant: 'destructive',
      });
    }
  }

  function quickLogin(acc: { email: string }) {
    setEmail(acc.email);
    setPassword('demo');
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel */}
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-accent p-8 text-white lg:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-white" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Ship className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
                Afridi Trading Japan
              </p>
              <p className="text-xs text-white/60">Internal ERP Communication</p>
            </div>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
            One Team.<br />One System.<br />One Conversation.
          </h1>
          <p className="mt-4 text-base text-white/80">
            ATJ Chat connects your vehicles, shipments, and teams into a single
            conversation — so nothing gets lost in WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: Users, label: 'Teams' },
              { icon: Car, label: 'Vehicles' },
              { icon: Container, label: 'Shipments' },
              { icon: ShieldCheck, label: 'Permissions' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-4 text-xs text-white/70">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> ERP Integration: READY
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1">
            Mode: DEMO
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1">
            API: MOCK
          </span>
        </div>
      </div>

      {/* Login form */}
      <div className="flex w-full flex-col justify-center px-6 py-10 lg:w-[480px] lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to ATJ Chat
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to access the workspace.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@atj.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Signing in…' : 'LOGIN'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Demo Accounts
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => quickLogin(acc)}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent/5"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${acc.color} text-xs font-bold text-white`}
                  >
                    {acc.label.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {acc.label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {acc.roleLabel}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    Use →
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Password for all demo accounts: <span className="font-semibold">demo</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
