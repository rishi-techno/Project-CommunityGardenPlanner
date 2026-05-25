# 🌱 Community Garden Management System — Backend

A production-ready Spring Boot REST API for managing community gardens, plots, plants, watering schedules, members, and events.

---

## ⚙️ Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Language    | Java 17                          |
| Framework   | Spring Boot 3.2                  |
| Security    | Spring Security + JWT (JJWT)     |
| Database    | MySQL 8                          |
| ORM         | Spring Data JPA / Hibernate      |
| Build       | Maven                            |
| Utilities   | Lombok, Jakarta Validation       |

---

## 🗂️ Project Structure

```
src/main/java/com/gardenmanagement/
├── controller/       AuthController, PlotController, PlantController,
│                     EventController, WateringController, MemberController
├── service/          AuthService, PlotService, PlantService,
│                     EventService, WateringService, MemberService
├── repository/       UserRepository, PlotRepository, PlantRepository,
│                     EventRepository, WateringRepository
├── entity/           User, GardenPlot, Plant, WateringSchedule, Event
├── dto/              LoginRequest, RegisterRequest, AuthResponse,
│                     PlotDTO, PlantDTO, EventDTO, WateringDTO
├── security/         JwtUtil, JwtFilter, SecurityConfig, CustomUserDetailsService
└── exception/        GlobalExceptionHandler, ResourceNotFoundException,
                      DuplicateEmailException
```

---

## 🚀 Setup & Run

### 1. Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+

### 2. Create the Database

```sql
CREATE DATABASE community_garden_db;
```

Or run the full schema + seed data:

```bash
mysql -u root -p < schema.sql
```

### 3. Configure `application.properties`

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/community_garden_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 4. Build & Run

```bash
mvn clean install
mvn spring-boot:run
```

Server starts at: **http://localhost:8080**

---

## 🔐 Authentication

JWT-based stateless authentication. Include the token in every protected request:

```
Authorization: Bearer <your_jwt_token>
```

### Roles
| Role   | Access                                    |
|--------|-------------------------------------------|
| ADMIN  | Full access to all endpoints              |
| MEMBER | Read-only on plots & events; manage own plants/watering |

---

## 📡 REST API Reference

### Auth Endpoints (Public)
| Method | URL                    | Description         |
|--------|------------------------|---------------------|
| POST   | /api/auth/register     | Register new user   |
| POST   | /api/auth/login        | Login, get JWT      |

### Garden Plot Endpoints
| Method | URL                    | Role         | Description          |
|--------|------------------------|--------------|----------------------|
| GET    | /api/plots             | ADMIN/MEMBER | Get all plots        |
| GET    | /api/plots/{id}        | ADMIN/MEMBER | Get plot by ID       |
| GET    | /api/plots/available   | ADMIN/MEMBER | Get available plots  |
| GET    | /api/plots/search?keyword= | ADMIN/MEMBER | Search plots    |
| POST   | /api/plots             | ADMIN        | Create plot          |
| PUT    | /api/plots/{id}        | ADMIN        | Update plot          |
| DELETE | /api/plots/{id}        | ADMIN        | Delete plot          |

### Plant Endpoints
| Method | URL                        | Role         | Description              |
|--------|----------------------------|--------------|--------------------------|
| GET    | /api/plants                | ADMIN/MEMBER | Get all plants           |
| GET    | /api/plants/{id}           | ADMIN/MEMBER | Get plant by ID          |
| GET    | /api/plants/category?name= | ADMIN/MEMBER | Filter by category       |
| GET    | /api/plants/plot/{plotId}  | ADMIN/MEMBER | Get plants by plot       |
| POST   | /api/plants                | ADMIN/MEMBER | Create plant             |
| PUT    | /api/plants/{id}           | ADMIN/MEMBER | Update plant             |
| DELETE | /api/plants/{id}           | ADMIN/MEMBER | Delete plant             |

### Watering Schedule Endpoints
| Method | URL                         | Role         | Description                    |
|--------|-----------------------------|--------------|--------------------------------|
| GET    | /api/watering               | ADMIN/MEMBER | Get all schedules              |
| GET    | /api/watering/upcoming      | ADMIN/MEMBER | Get upcoming schedules         |
| GET    | /api/watering/plot/{plotId} | ADMIN/MEMBER | Get schedules for a plot       |
| POST   | /api/watering               | ADMIN/MEMBER | Create schedule                |
| PUT    | /api/watering/{id}          | ADMIN/MEMBER | Update schedule                |
| DELETE | /api/watering/{id}          | ADMIN/MEMBER | Delete schedule                |

### Event Endpoints
| Method | URL                    | Role         | Description          |
|--------|------------------------|--------------|----------------------|
| GET    | /api/events            | ADMIN/MEMBER | Get all events       |
| GET    | /api/events/{id}       | ADMIN/MEMBER | Get event by ID      |
| GET    | /api/events/upcoming   | ADMIN/MEMBER | Get upcoming events  |
| POST   | /api/events            | ADMIN        | Create event         |
| PUT    | /api/events/{id}       | ADMIN        | Update event         |
| DELETE | /api/events/{id}       | ADMIN        | Delete event         |

### Member Endpoints (ADMIN only)
| Method | URL                | Role  | Description       |
|--------|--------------------|-------|-------------------|
| GET    | /api/members       | ADMIN | Get all members   |
| GET    | /api/members/{id}  | ADMIN | Get member by ID  |
| DELETE | /api/members/{id}  | ADMIN | Delete member     |

---

## 🧪 Postman Testing Examples

### 1. Register Admin

**POST** `http://localhost:8080/api/auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@garden.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "Admin User",
  "email": "admin@garden.com",
  "role": "ADMIN"
}
```

---

### 2. Login

**POST** `http://localhost:8080/api/auth/login`

```json
{
  "email": "admin@garden.com",
  "password": "admin123"
}
```

Copy the `token` value → use as `Authorization: Bearer <token>` in all further requests.

---

### 3. Create a Garden Plot

**POST** `http://localhost:8080/api/plots`
**Header:** `Authorization: Bearer <token>`

```json
{
  "plotNumber": "C-01",
  "size": "10x10",
  "status": "AVAILABLE"
}
```

---

### 4. Create a Plant

**POST** `http://localhost:8080/api/plants`
**Header:** `Authorization: Bearer <token>`

```json
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

### 5. Schedule a Watering

**POST** `http://localhost:8080/api/watering`
**Header:** `Authorization: Bearer <token>`

```json
{
  "wateringDate": "2025-05-10",
  "wateringTime": "07:00:00",
  "status": "SCHEDULED",
  "notes": "Morning deep watering",
  "plotId": 1
}
```

---

### 6. Create an Event

**POST** `http://localhost:8080/api/events`
**Header:** `Authorization: Bearer <token>`

```json
{
  "eventName": "Autumn Seed Swap",
  "description": "Bring seeds to trade with other members",
  "eventDate": "2025-09-15T10:00:00",
  "location": "Community Garden Pavilion"
}
```

---

## 🗃️ Database Entities & Relationships

```
User (1) ──────────── (N) GardenPlot
                              │
                 ┌────────────┴───────────┐
                 │                        │
           Plant (N)           WateringSchedule (N)

Event  (standalone — no FK relationships)
```

---

## 🔧 Seed Data Credentials

| Email             | Password  | Role   |
|-------------------|-----------|--------|
| admin@garden.com  | admin123  | ADMIN  |
| alice@garden.com  | member123 | MEMBER |
| bob@garden.com    | member123 | MEMBER |
| carol@garden.com  | member123 | MEMBER |

---

## 🛡️ Security Notes

- All passwords are stored as **BCrypt hashes**
- JWT tokens expire after **24 hours** (configurable via `jwt.expiration`)
- Change `jwt.secret` in `application.properties` to a strong random Base64 string before deploying
- HTTPS strongly recommended in production
