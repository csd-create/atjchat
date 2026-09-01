# ATJ Chat — Internal ERP Communication

**Afridi Trading Japan** · One Team. One System. One Conversation.

ATJ Chat is an internal ERP communication prototype that connects your vehicles, shipments, and teams into a single conversation — so staff never need to search through WhatsApp to understand what happened to a vehicle or shipment.

> **Current Mode: DEMO** · **API Connection: MOCK** · **ERP Integration: READY**
>
> This is a prototype. The service layer is designed so a real ERP API can be connected later without changing the UI.

---

## Features

### Chat Dashboard
- Modern business messenger layout with searchable conversation list
- **Direct Messages** — one-on-one conversations between staff
- **Department Channels** — Pakistan Operations, Japan Yard, Accounts, Shipping, Sales, Management
- **Vehicle-Linked Chat** — every vehicle has its own communication history
- **Shipment-Linked Chat** — every shipment has its own discussion thread
- **Private Management Channel** — restricted to Manager and Administrator roles (lock icon)
- Message bubbles with timestamps, read receipts (✓ Sent · ✓✓ Delivered · ✓✓ Read)
- Emoji picker, file/image/PDF attachment simulation
- @mentions that automatically generate notifications

### Vehicle Management
- Searchable vehicle card grid (reference, chassis, make/model, destination, status)
- Vehicle detail page with full specs, linked shipment, linked tasks
- Dedicated discussion thread per vehicle — the core "chat connected to business records" concept

### Shipment Management
- Searchable shipment card grid (container, destination, ETD/ETA, status, vehicles)
- Shipment detail page with linked vehicles and dedicated discussion thread

### Teams / Staff Directory
- All staff with name, department, role, and online status
- Click any team member to open a direct chat

### Tasks
- Task list with priority (HIGH / NORMAL / LOW) and status (PENDING / IN PROGRESS / COMPLETED)
- Start and Complete action buttons
- Tasks linked to specific vehicles or shipments

### Notifications
- Mention, message, task, vehicle, and shipment notifications
- Mark as read / Mark all as read

### Global Search
- Search across staff, vehicles, chassis numbers, ATJ references, containers, booking numbers, and messages

### Dashboard
- Today's activity summary (messages, vehicle discussions, shipment updates, pending tasks, online staff)
- Recent activity feed
- Quick access to recent vehicles, shipments, and online staff

### Role-Based Permissions

| Capability | Staff | Manager | Administrator |
|---|:---:|:---:|:---:|
| Send messages | ✓ | ✓ | ✓ |
| View departments, vehicle & shipment chats | ✓ | ✓ | ✓ |
| Create department conversations | — | ✓ | ✓ |
| Assign tasks | — | ✓ | ✓ |
| Manage department members | — | ✓ | ✓ |
| Access management area | — | — | ✓ |
| Manage users & permissions | — | — | ✓ |

---

## Demo Accounts

All accounts use the password **`demo`**.

| Name | Email | Department | Role |
|---|---|---|---|
| Raheel Hayat | raheel@atj.com | Operations | Operations Executive |
| Japan Manager | japan@atj.com | Japan Operations | Manager |
| Sales Team | sales@atj.com | Sales | Sales Executive |
| Shipping Team | shipping@atj.com | Shipping | Shipping Executive |
| Management | admin@atj.com | Management | Administrator |

---

## Tech Stack

- **Next.js 13** (App Router)
- **TypeScript**
- **Tailwind CSS** with a custom corporate design system
- **shadcn/ui** component library
- **Lucide React** icons
- **Supabase-ready** architecture (currently using mock data)

---

## Architecture

```
ATJ CHAT  →  API SERVICE LAYER  →  ERP API  →  ERP DATABASE
```

The application is structured so that connecting a real ERP API requires changes in only one place:

### Service Layer (`services/erpApi.ts`)

All data access goes through the `erpApi` service object. It currently returns mock data from `lib/mock-data.ts`, but each function is the single integration point for a real ERP:

```typescript
erpApi.getUsers()           // → real ERP user list
erpApi.getVehicles()        // → real ERP vehicle inventory
erpApi.getShipments()       // → real ERP shipment records
erpApi.getVehicle(id)       // → single vehicle by ID
erpApi.getShipment(id)      // → single shipment by ID
erpApi.getConversations()   // → conversation metadata
erpApi.getMessages(convId)  // → message history per conversation
erpApi.authenticate()       // → real ERP auth
erpApi.search(query)        // → cross-entity search
```

To connect a real ERP, replace the mock imports inside each function with `fetch` calls to your ERP API. No UI changes required.

### Message Structure

Messages follow a shape ready for Supabase Realtime or WebSockets:

```typescript
{
  id, conversationId, senderId, senderName,
  message, timestamp, attachments, readStatus, mentions
}
```

### Key Directories

```
app/
  login/              Login screen
  dashboard/          Home dashboard
  chat/               Main chat (conversation list + chat view)
  vehicles/           Vehicle list + [id] detail with linked chat
  shipments/          Shipment list + [id] detail with linked chat
  teams/              Staff directory
  tasks/              Task management
  notifications/      Notification panel
  profile/            User profile + permissions + ERP status
  search/             Global search

components/
  chat/               ChatView, ConversationList, RecordChat
  AppShell.tsx        Sidebar nav + layout wrapper + route guard
  StatusBadges.tsx    Status / priority / online badges
  Logo.tsx            ATJ branded logo

context/
  AppContext.tsx      Global state (auth, messages, tasks, notifications)

services/
  erpApi.ts           ERP API service layer (swap mock → real)

lib/
  mock-data.ts        Mock users, vehicles, shipments, conversations, messages, tasks

types/
  index.ts            All TypeScript interfaces
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with any demo account (password: `demo`).

### Build

```bash
npm run build
```

---

## Deployment

This app is deployable on **Vercel** or **Netlify**.

### Vercel
1. Push this repository to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Deploy — no environment variables needed for demo mode

### Netlify
A `netlify.toml` is included with the Next.js plugin preconfigured.

---

## Integrating ATJ Chat Into an Existing ERP

ATJ Chat is designed as a **drop-in communication module** that layers on top of your existing ERP system. You do not need to modify your ERP — you only need to expose (or create) a few API endpoints that ATJ Chat can call.

### What ATJ Chat Needs From Your ERP

ATJ Chat talks to your ERP through a single file: `services/erpApi.ts`. Each function in that file maps to one piece of data your ERP already manages (or can easily expose). Here is the full list:

| ATJ Chat Function | What It Does | Your ERP Needs To Provide |
|---|---|---|
| `authenticate(email, password)` | Log in a user | A way to verify email + password and return the user record |
| `getUsers()` | Staff directory, chat sidebar, @mentions | A list of all staff with id, name, email, department, role |
| `getUser(id)` | Profile page, message sender info | A single user by ID |
| `getVehicles()` | Vehicle list page, vehicle-linked chats | A list of vehicles with id, reference, chassis, make, model, status, destination |
| `getVehicle(id)` | Vehicle detail page | A single vehicle by ID |
| `getShipments()` | Shipment list page, shipment-linked chats | A list of shipments with id, container, destination, ETD, ETA, status |
| `getShipment(id)` | Shipment detail page | A single shipment by ID |
| `getConversations()` | Chat conversation list | Conversation metadata (type, name, members, linked record ID) |
| `getMessages(convId)` | Chat message history | Messages for a given conversation |
| `getTasks()` | Task list | Tasks with assignee, priority, status, linked vehicle/shipment |
| `getNotifications()` | Notification panel | Notifications per user |
| `search(query)` | Global search | Search across users, vehicles, shipments, and messages |

### Step-by-Step: Connecting Your ERP

#### Step 1 — Expose API endpoints on your ERP

Your ERP needs to expose the data above as HTTP endpoints. If your ERP already has a REST API, you may only need to add a few missing endpoints. A typical endpoint map:

```
GET  /api/users                    → list of staff
GET  /api/users/:id                → single user
POST /api/auth/login               → authenticate (email + password → user + token)
GET  /api/vehicles                 → vehicle inventory
GET  /api/vehicles/:id             → single vehicle
GET  /api/shipments                → shipment list
GET  /api/shipments/:id            → single shipment
GET  /api/conversations            → conversation list
GET  /api/conversations/:id/messages → messages for a conversation
GET  /api/tasks                    → task list
GET  /api/notifications            → notifications
GET  /api/search?q=...             → cross-entity search
```

If your ERP does not have conversations/messages (most don't), you can store those in Supabase instead — see **Option B** below.

#### Step 2 — Configure environment variables

Add these to your `.env` file:

```env
# Your ERP API base URL
ERP_API_BASE_URL=https://your-erp-domain.com/api

# API key or token your ERP accepts
ERP_API_KEY=your-secret-api-key
```

#### Step 3 — Wire up the service layer

Open `services/erpApi.ts` and replace each mock function with a real `fetch` call. The function signatures and return types stay the same — only the body changes.

**Before (mock):**
```typescript
async getVehicles(): Promise<Vehicle[]> {
  return delay(mockVehicles);
}
```

**After (real ERP):**
```typescript
async getVehicles(): Promise<Vehicle[]> {
  const res = await fetch(`${process.env.ERP_API_BASE_URL}/vehicles`, {
    headers: {
      'Authorization': `Bearer ${process.env.ERP_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`ERP error: ${res.status}`);
  const data = await res.json();
  // Map your ERP fields to ATJ Chat's Vehicle interface
  return data.map((v: any) => ({
    id: v.id,
    reference: v.atj_ref,
    make: v.make,
    model: v.model,
    chassis: v.chassis_no,
    status: v.status,
    destination: v.destination,
    booking: v.booking_no,
    year: v.year,
    color: v.color,
    price: v.price,
  }));
}
```

Repeat this pattern for each function. The key step is **mapping your ERP's field names** to ATJ Chat's TypeScript interfaces (defined in `types/index.ts`).

#### Step 4 — Handle field name mapping

Your ERP will likely use different field names than ATJ Chat. The mapping happens in each service function. Here is a quick reference:

| ATJ Chat Field | Typical ERP Field | Notes |
|---|---|---|
| `User.id` | `user_id` / `id` | Must be unique string |
| `User.role` | `role` / `user_type` | Must be `'staff'` / `'manager'` / `'admin'` |
| `User.department` | `department` / `dept_code` | Free-text string |
| `Vehicle.reference` | `atj_ref` / `stock_no` | The ATJ reference number |
| `Vehicle.chassis` | `chassis_no` / `vin` | Chassis/VIN number |
| `Shipment.container` | `container_no` | Container number |
| `Shipment.etd` / `eta` | `etd` / `eta` | Date strings (ISO format recommended) |

#### Step 5 — Handle authentication

Replace the mock `authenticate` function with a call to your ERP's login endpoint. ATJ Chat expects the function to return a `User` object on success or `null` on failure:

```typescript
async authenticate(email: string, password: string): Promise<User | null> {
  const res = await fetch(`${process.env.ERP_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const { user } = await res.json();
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',  // never store the password
    department: user.department,
    role: user.role,
    roleLabel: user.role_label,
    status: 'online',
    avatarColor: user.avatar_color ?? '#0066CC',
  };
}
```

After login, store the ERP session token and include it in the `Authorization` header for all subsequent requests.

### Two Integration Options

#### Option A — Fully ERP-Hosted

All data (users, vehicles, shipments, conversations, messages, tasks) lives in your ERP. You create endpoints for conversations and messages on your ERP, and ATJ Chat calls them directly.

**Best when:** Your ERP already has a chat/messaging feature, or you want all data in one database.

#### Option B — Hybrid (ERP + Supabase)

Your ERP remains the source of truth for **vehicles, shipments, users, and tasks**. Conversations and messages are stored in **Supabase** (which is already provisioned for this project). ATJ Chat calls your ERP for business data and Supabase for chat data.

**Best when:** Your ERP doesn't have messaging built in (most don't), and you want real-time chat with minimal ERP changes.

To use Option B:
1. Create a `conversations` table and a `messages` table in Supabase
2. Link each conversation to an ERP record by storing the ERP's record ID in a `record_id` column
3. Replace only the conversation/message functions in `erpApi.ts` with Supabase queries
4. Enable Supabase Realtime on the `messages` table for live chat updates

Example Supabase query for messages:

```typescript
import { supabase } from '@/lib/supabase';

async getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return data;
}
```

### Security Checklist

When connecting a real ERP, ensure you:

- [ ] Use HTTPS for all ERP API calls — never HTTP
- [ ] Store API keys and secrets in `.env`, never in source code
- [ ] Validate the ERP response shape before using it in the UI
- [ ] Map ERP role values to `'staff'` / `'manager'` / `'admin'` — ATJ Chat's permissions depend on these
- [ ] If using Option B (Supabase), enable Row Level Security on conversations and messages tables so users can only see conversations they're members of
- [ ] Rate-limit the search endpoint if your ERP is slow

### Testing the Integration

After wiring up the service layer:

1. Run `npm run dev` and log in with real ERP credentials
2. Check the Teams page — you should see real staff from your ERP
3. Check the Vehicles page — you should see real vehicle inventory
4. Check the Shipments page — you should see real shipment records
5. Open a vehicle detail page — the linked chat should work
6. Use global search — it should return results from your ERP data

If any page is empty, check the browser console for fetch errors and verify your ERP endpoints are returning data in the expected shape.

---

## License

Internal prototype for Afridi Trading Japan. All rights reserved.
