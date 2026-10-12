# Hostel Accommodation & Mess Management System

A full-stack web application for managing hostel accommodations, mess attendance, and maintenance complaints.

## Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3.2** (Web, Data JPA, Validation)
- **MySQL / H2 Database**
- **Maven**
- **SpringDoc OpenAPI** (Swagger UI)

### Frontend
- **React 18** (Vite)
- **Tailwind CSS**
- **Lucide React** (Icons)
- **Axios** (API Communication)
- **React Router v6**
- **date-fns** (Date formatting)

## Project Structure

```
Java_Project/
├── backend/                 # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hostel/management/
│   │   │   │   ├── entity/          # JPA Entities
│   │   │   │   ├── repository/      # Spring Data JPA Repositories
│   │   │   │   ├── service/         # Business Logic Services
│   │   │   │   ├── controller/      # REST Controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── exception/       # Custom Exceptions & Global Handler
│   │   │   │   ├── config/          # Configuration Classes
│   │   │   │   ├── initializer/     # Data Initialization
│   │   │   │   └── HostelManagementApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml  # Configuration
│   │   └── test/
│   └── pom.xml                   # Maven Dependencies
├── frontend/                     # React Application
│   ├── src/
│   │   ├── components/            # Reusable UI Components
│   │   ├── pages/                 # Page Components
│   │   ├── services/              # API Service Layer
│   │   ├── types/                 # Type Definitions & Enums
│   │   ├── utils/                 # Utility Functions
│   │   ├── App.jsx                # Main App with Routing
│   │   ├── main.jsx               # Entry Point
│   │   └── index.css              # Tailwind + Custom Styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Features

### 1. Dashboard
- Overview statistics (Total Students, Occupied Rooms, Today's Mess Count, Open Complaints)
- Quick action buttons for common tasks
- Room occupancy visualization
- Complaint status summary

### 2. Room Management
- Visual grid of rooms with color-coded status
- Room creation with capacity settings
- Student assignment/unassignment
- Room status management (Available, Full, Maintenance)
- Search and filter capabilities

### 3. Student Management
- Complete CRUD operations for students
- Room assignment tracking
- Fee status management (Paid, Pending, Overdue)
- Search and filter by fee status

### 4. Mess Tracker
- Daily meal attendance logging (Breakfast, Lunch, Dinner)
- Interactive calendar/date selector
- Quick-toggle attendance marking
- Monthly bill calculation with per-meal breakdown
- Export monthly bills for all students

### 5. Complaint Registry
- Ticket system with categories (Plumbing, Electrical, Cleaning, Internet, Other)
- Status tracking (Pending, In Progress, Resolved)
- Filter by status and category
- Pagination support
- Student association

## Getting Started

### Prerequisites
- **Java 17+** (JDK)
- **Maven 3.8+**
- **Node.js 18+** and **npm**
- **MySQL 8.0+** (optional, H2 in-memory used by default)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Configure database (optional - uses H2 in-memory by default):
   - Edit `src/main/resources/application.yml`
   - Uncomment and configure MySQL section for production use

3. Build and run:
   ```bash
   # Using Maven wrapper (if available)
   ./mvnw spring-boot:run

   # Or using installed Maven
   mvn spring-boot:run
   ```

4. Backend will start at `http://localhost:8080`

5. Access H2 Console (development): `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:hostel_db`
   - Username: `sa`
   - Password: (empty)

6. Access Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Frontend will start at `http://localhost:5173`
   - Proxied to backend at `http://localhost:8080/api`

### Building for Production

#### Backend
```bash
cd backend
mvn clean package
# Run the JAR
java -jar target/hostel-management-system-1.0.0.jar
```

#### Frontend
```bash
cd frontend
npm run build
# Output in dist/ directory
# Serve with nginx, Apache, or any static file server
```

## API Endpoints

### Students
- `GET /api/students` - List all students
- `GET /api/students/{id}` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student
- `POST /api/students/{id}/assign-room` - Assign room
- `DELETE /api/students/{id}/unassign-room` - Unassign room
- `GET /api/students/unassigned` - Get unassigned students
- `GET /api/students/fee-status/{status}` - Filter by fee status

### Rooms
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/{id}` - Get room by ID
- `GET /api/rooms/number/{roomNumber}` - Get room by number
- `POST /api/rooms` - Create room
- `PATCH /api/rooms/{id}/status` - Update room status
- `DELETE /api/rooms/{id}` - Delete room
- `GET /api/rooms/available` - Get available rooms
- `GET /api/rooms/status/{status}` - Filter by status

### Mess Attendance
- `GET /api/mess` - List all attendance
- `GET /api/mess/date/{date}` - Get attendance by date
- `GET /api/mess/date/{date}/meal/{mealType}` - Get by date and meal
- `GET /api/mess/student/{studentId}` - Get student attendance
- `POST /api/mess` - Mark attendance
- `DELETE /api/mess/{id}` - Delete attendance record
- `GET /api/mess/today/count` - Today's total count
- `GET /api/mess/date/{date}/meal/{mealType}/count` - Meal count
- `GET /api/mess/bill/student/{studentId}/month/{year}/{month}` - Student monthly bill
- `GET /api/mess/bill/month/{year}/{month}` - All monthly bills

### Complaints
- `GET /api/complaints` - List complaints (with filters & pagination)
- `GET /api/complaints/{id}` - Get complaint by ID
- `GET /api/complaints/student/{studentId}` - Get by student
- `GET /api/complaints/status/{status}` - Filter by status
- `POST /api/complaints` - Create complaint
- `PATCH /api/complaints/{id}` - Update complaint status
- `DELETE /api/complaints/{id}` - Delete complaint
- `GET /api/complaints/stats/pending` - Pending count
- `GET /api/complaints/stats/in-progress` - In progress count
- `GET /api/complaints/stats/resolved` - Resolved count

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

### Students
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, Auto-increment |
| name | VARCHAR(255) | Not Null |
| email | VARCHAR(255) | Not Null, Unique |
| phone | VARCHAR(20) | |
| room_number | VARCHAR(20) | FK to Rooms |
| fee_status | ENUM | PAID, PENDING, OVERDUE |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Rooms
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, Auto-increment |
| room_number | VARCHAR(20) | Not Null, Unique |
| capacity | INT | Not Null, Min 1 |
| current_occupancy | INT | Default 0 |
| status | ENUM | AVAILABLE, FULL, MAINTENANCE |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Mess Attendance
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, Auto-increment |
| student_id | BIGINT | Not Null, FK to Students |
| date | DATE | Not Null |
| meal_type | ENUM | BREAKFAST, LUNCH, DINNER |
| status | ENUM | PRESENT, ABSENT |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Complaints
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, Auto-increment |
| student_id | BIGINT | Not Null, FK to Students |
| category | ENUM | PLUMBING, ELECTRICAL, CLEANING, INTERNET, OTHER |
| description | TEXT | Not Null |
| status | ENUM | PENDING, IN_PROGRESS, RESOLVED |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| resolved_at | TIMESTAMP | |

## Sample Data

On startup, the application initializes with:
- 10 Rooms (mix of 2 and 3 seaters, one in maintenance)
- 10 Students (some assigned to rooms, various fee statuses)
- 7 days of mess attendance for each student
- 5 Sample complaints across different categories and statuses

## Configuration

### Backend (application.yml)
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:mem:hostel_db  # Change for MySQL
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create-drop  # Use 'update' for production
  h2:
    console:
      enabled: true
```

### Frontend (vite.config.js)
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## Development Tips

1. **Hot Reload**: Both backend (Spring Boot DevTools) and frontend (Vite) support hot reload
2. **Database**: H2 console available at `/h2-console` for development
3. **API Docs**: Swagger UI at `/swagger-ui.html`
4. **CORS**: Configured for `http://localhost:5173` and `http://localhost:3000`

## Troubleshooting

### Backend won't start
- Check Java version: `java -version` (should be 17+)
- Check port 8080 is free
- Check Maven dependencies: `mvn clean install`

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check proxy configuration in `vite.config.js`
- Verify CORS settings in `CorsConfig.java`

### Build failures
- Clear Maven cache: `mvn clean`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## License

This project is for educational/demo purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request