# 🛠️ Roadmap: Real-Time Game Lobby & Chat App

**Stack**: Node.js + NestJS • React (with Vite) • PostgreSQL • Redis • Kafka • Minikube

---

## **Phase 1 – Core Setup**

**Goal**: Lay the foundation of the project.

1. **Initialize repos**

   * Create a GitHub monorepo (or separate frontend + backend repos).
   * Set up basic CI (GitHub Actions) for linting and testing.

2. **Backend (NestJS)**

   * `nest new backend`
   * Create a health check endpoint (`/health`).
   * Add TypeORM or Prisma with **PostgreSQL** integration.

3. **Frontend (React + Vite)**

   * `npm create vite@latest frontend` → pick React + TS.
   * Simple landing page that calls backend `/health`.

✅ **Milestone 1 deliverable**: Running NestJS API + React app with Postgres connection.

---

## **Phase 2 – Authentication & User System**

**Goal**: Implement basic accounts.

1. **Backend**

   * Create `User` entity in Postgres.
   * Add REST endpoints: register, login, profile.
   * Use **Redis** for session storage or caching JWT tokens.

2. **Frontend**

   * Login & signup forms in React.
   * Store auth token in localStorage.

✅ **Milestone 2 deliverable**: Users can register/login and see their profile page.

---

## **Phase 3 – Game Lobby System (CQRS)**

**Goal**: Practice CQRS with commands/queries.

1. **Backend (CQRS)**

   * Implement **Commands**: `CreateLobbyCommand`, `JoinLobbyCommand`, `LeaveLobbyCommand`.
   * Implement **Queries**: `GetLobbyQuery`, `ListLobbiesQuery`.
   * Store lobby data in Postgres.

2. **Frontend**

   * Lobby list page (fetch from `ListLobbiesQuery`).
   * Create/join lobby UI.

✅ **Milestone 3 deliverable**: Users can create and join lobbies.

---

## **Phase 4 – Real-Time Events with Kafka & Redis**

**Goal**: Add pub/sub features.

1. **Backend**

   * Integrate **Kafka** with NestJS microservices.
   * Publish events: `userJoinedLobby`, `userLeftLobby`.
   * Use **Redis** as a cache for “active users in lobby.”

2. **Frontend**

   * Connect with WebSockets or SSE to listen for lobby updates.
   * Show real-time lobby members.

✅ **Milestone 4 deliverable**: Lobbies update in real time when users join/leave.

---

## **Phase 5 – Chat Feature**

**Goal**: Add lobby chat with persistence + streaming.

1. **Backend**

   * Store chat messages in Postgres.
   * Cache last 50 messages in Redis for quick access.
   * Kafka publishes `messageSent` events to all lobby members.

2. **Frontend**

   * Lobby chat UI with real-time updates.
   * Load history (from Postgres), stream new messages (via Kafka/WebSockets).

✅ **Milestone 5 deliverable**: Real-time chat in each lobby.

---

## **Phase 6 – Dockerization**

**Goal**: Containerize everything.

* Write Dockerfiles for frontend + backend.
* Use Docker Compose with Postgres, Redis, Kafka (Confluent Platform).
* Ensure local development runs with `docker-compose up`.

✅ **Milestone 6 deliverable**: Full app runs in containers.

---

## **Phase 7 – Minikube Deployment**

**Goal**: Practice Kubernetes locally.

1. **Create Kubernetes manifests** for:

   * Frontend deployment + service
   * Backend deployment + service
   * Postgres (statefulset)
   * Redis (deployment)
   * Kafka (statefulset or use Strimzi operator)

2. **Ingress** with NGINX for frontend + backend routing.

✅ **Milestone 7 deliverable**: App runs on Minikube.

---

## **Phase 8 – (Optional) Cloud Deployment**

**Goal**: Get experience with AWS free tier (or alternative).

1. Deploy containers to AWS EKS (or GCP GKE).
2. Use managed Postgres (RDS, Supabase, or Railway).
3. Use managed Redis (Upstash).
4. Use managed Kafka (Confluent Cloud).

✅ **Final deliverable**: Live demo URL + GitHub repo for portfolio.

---

### ⚡ Learning Checklist per Technology

* **NestJS** → Learn modules, providers, CQRS package.
* **React + Vite** → SPA setup, API calls, WebSockets/SSE.
* **PostgreSQL** → SQL schemas, migrations (Prisma or TypeORM).
* **Redis** → Session storage, caching queries.
* **Kafka** → Event-driven microservices, NestJS Kafka transport.
* **Minikube** → Deployments, services, ingress, config maps, secrets.
