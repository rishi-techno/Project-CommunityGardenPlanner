markdown

# 🌱 Community Garden Management System

A full-stack web application for managing community gardens — plots, plants, watering schedules, events, and members. Built with **Spring Boot** (backend) and **React.js** (frontend).

---

## 📸 Overview

| Feature | Description |
|---|---|
| 🔐 Authentication | JWT-based login & registration |
| 🌾 Garden Plots | Create, assign, edit, delete plots |
| 🌿 Plants | Track plants by category, growth status, harvest date |
| 💧 Watering | Schedule and track watering tasks per plot |
| 📅 Events | Manage community garden events |
| 👥 Members | Admin can view and remove members |
| 👤 Profile | View account info and logout |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Programming language |
| Spring Boot 3.2 | Backend framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA | Database ORM |
| JWT (JJWT 0.11.5) | Stateless token auth |
| MySQL 8 | Relational database |
| Lombok | Boilerplate reduction |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client |
| Context API | Auth state management |
| CSS3 | Styling (no external UI library) |
| DM Serif + DM Sans | Google Fonts |

---

## 📁 Project Structure

```
community-garden-management-system/
│
├── community-garden/                  ← Spring Boot Backend
│   ├── src/main/java/com/gardenmanagement/
│   │   ├── controller/                ← REST API endpoints
│   │   ├── service/                   ← Business logic
│   │   ├── repository/                ← JPA database queries
│   │   ├── entity/                    ← JPA entities
│   │   ├── dto/                       ← Data Transfer Objects
│   │   ├── security/                  ← JWT, filters, config
│   │   └── exception/                 ← Global error handling
│   ├── src/main/resources/
│   │   └── application.properties     ← DB & JWT config
│   ├── schema.sql                      ← DB schema + seed data
│   └── pom.xml
│
└── community-garden-client/           ← React Frontend
    ├── src/
    │   ├── components/                ← Reusable UI components
    │   ├── pages/                     ← Full page views
    │   ├── services/                  ← Axios API calls
    │   ├── context/                   ← AuthContext (JWT state)
    │   └── styles/                    ← CSS design system
    ├── public/
    │   └── index.html
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure the following are installed before running the project:

- ✅ Java 17+
- ✅ Maven 3.8+
- ✅ MySQL 8+
- ✅ Node.js 18+
- ✅ npm 9+

---

## 🗄️ Database Setup

### Step 1 — Create the database and seed data

Open your terminal and run:

```bash
mysql -u root -p < community-garden/schema.sql
```

This will:
- Create the `community_garden_db` database
- Create all tables (`users`, `garden_plots`, `plants`, `watering_schedules`, `events`)
- Insert the default admin account and 3 demo members

### Step 2 — Verify

```sql
USE community_garden_db;
SELECT id, name, email, role FROM users;
```

You should see:

| id | name | email | role |
|---|---|---|---|
| 1 | Admin User | admin@garden.com | ADMIN |
| 2 | Alice Green | alice@garden.com | MEMBER |
| 3 | Bob Sprout | bob@garden.com | MEMBER |
| 4 | Carol Bloom | carol@garden.com | MEMBER |

---

## 🚀 Running the Backend

### Step 1 — Configure database credentials

Open `community-garden/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/community_garden_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 2 — Build and run

```bash
cd community-garden
mvn clean install
mvn spring-boot:run
```

### Step 3 — Verify

Backend is running at: **http://localhost:8080**

Test it:
```bash
curl http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@garden.com","password":"admin123"}'
```

You should get back a JWT token in the response.

---

## 💻 Running the Frontend

### Step 1 — Install dependencies

```bash
cd community-garden-client
npm install
```

### Step 2 — Start the dev server

```bash
npm start
```

App opens at: **http://localhost:3000**

> The `"proxy": "http://localhost:8080"` in `package.json` automatically forwards all `/api/*` requests to the backend — no CORS configuration needed in development.

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@garden.com | admin123 |
| Member | alice@garden.com | member123 |
| Member | bob@garden.com | member123 |
| Member | carol@garden.com | member123 |

---

## 📡 REST API Reference

### Auth (Public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Garden Plots
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/plots` | All | Get all plots |
| GET | `/api/plots/{id}` | All | Get plot by ID |
| GET | `/api/plots/available` | All | Get available plots |
| GET | `/api/plots/search?keyword=` | All | Search plots |
| POST | `/api/plots` | Admin | Create plot |
| PUT | `/api/plots/{id}` | Admin | Update plot |
| DELETE | `/api/plots/{id}` | Admin | Delete plot |

### Plants
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/plants` | All | Get all plants |
| GET | `/api/plants/{id}` | All | Get plant by ID |
| GET | `/api/plants/category?name=` | All | Filter by category |
| GET | `/api/plants/plot/{plotId}` | All | Get plants by plot |
| POST | `/api/plants` | All | Add plant |
| PUT | `/api/plants/{id}` | All | Update plant |
| DELETE | `/api/plants/{id}` | All | Delete plant |

### Watering Schedules
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/watering` | All | Get all schedules |
| GET | `/api/watering/upcoming` | All | Get upcoming |
| GET | `/api/watering/plot/{plotId}` | All | Get by plot |
| POST | `/api/watering` | All | Create schedule |
| PUT | `/api/watering/{id}` | All | Update schedule |
| DELETE | `/api/watering/{id}` | All | Delete schedule |

### Events
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/events` | All | Get all events |
| GET | `/api/events/{id}` | All | Get event by ID |
| GET | `/api/events/upcoming` | All | Get upcoming events |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events/{id}` | Admin | Update event |
| DELETE | `/api/events/{id}` | Admin | Delete event |

### Members
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/members` | Admin | Get all members |
| GET | `/api/members/{id}` | Admin | Get member by ID |
| DELETE | `/api/members/{id}` | Admin | Remove member |

---

## 🔐 Authentication Flow

```
1. User POSTs credentials to /api/auth/login
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. Every subsequent request includes:
   Authorization: Bearer <token>
5. Backend JwtFilter validates token on each request
6. On 401 → frontend auto-redirects to /login
7. Token expires after 24 hours (configurable)
```

---

## 👥 User Roles & Permissions

| Feature | ADMIN | MEMBER |
|---|---|---|
| View plots, plants, events | ✅ | ✅ |
| Add / edit / delete plots | ✅ | ❌ |
| Add / edit / delete plants | ✅ | ✅ |
| Manage watering schedules | ✅ | ✅ |
| Create / edit / delete events | ✅ | ❌ |
| View members list | ✅ | ❌ |
| Remove members | ✅ | ❌ |

---

## 🗃️ Database Schema

```
users
  id, name, email, password (BCrypt), role (ADMIN | MEMBER)

garden_plots
  id, plot_number, size, status (AVAILABLE | OCCUPIED | MAINTENANCE)
  assigned_user_id → users(id)  [SET NULL on delete]

plants
  id, plant_name, category, planting_date, harvest_date
  growth_status (SEEDLING | GROWING | MATURE | HARVESTED | DEAD)
  plot_id → garden_plots(id)  [CASCADE delete]

watering_schedules
  id, watering_date, watering_time
  status (SCHEDULED | COMPLETED | SKIPPED), notes
  plot_id → garden_plots(id)  [CASCADE delete]

events
  id, event_name, description, event_date, location
```

---

## 🧪 Testing with Postman

### 1. Login as Admin
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@garden.com",
  "password": "admin123"
}
```
Copy the `token` from the response.

### 2. Use token in all further requests
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### 3. Create a Plot
```
POST http://localhost:8080/api/plots
Authorization: Bearer <token>
Content-Type: application/json

{
  "plotNumber": "C-01",
  "size": "10x10",
  "status": "AVAILABLE"
}
```

### 4. Add a Plant
```
POST http://localhost:8080/api/plants
Authorization: Bearer <token>
Content-Type: application/json

{
  "plantName": "Carrot",
  "category": "Vegetable",
  "plantingDate": "2025-04-01",
  "harvestDate": "2025-07-01",
  "growthStatus": "SEEDLING",
  "plotId": 1
}
```

---

## 🏗️ Build for Production

### Backend
```bash
cd community-garden
mvn clean package
java -jar target/community-garden-management-system-1.0.0.jar
```

### Frontend
```bash
cd community-garden-client
npm run build
```
The `build/` folder contains the static files ready to serve via Nginx or any web server.

---

 
## 📄 License

This project is for educational purposes.



