# 🏢 Employee Leave Management System

**Leave Management Portal** where employees can apply for leave, managers can approve/reject requests, and admins can manage leave types and monitor records.

---

## 🚀 Features

* 👤 **Employee**

  * Apply for leave
  * View leave history
  * Cancel pending requests

* 👨‍💼 **Manager**

  * View team leave requests
  * Approve / Reject leave applications

* 🛠️ **Admin**

  * Manage leave types
  * View all leave records

* 🔐 **Authentication & Authorization**

  * JWT-based login system
  * Role-based access control (Employee / Manager / Admin)

---

## 🧰 Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React.js                          |
| Backend  | Node.js + Express                 |
| Database | MySQL                             |
| Styling  | Bootstrap 5                       |

---

## 📂 Project Structure

```
employee_leave_management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── leaveRequests.js
│   │   ├── leaveTypes.js
│   │   └── leaveBalances.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Navbar.js
│   │   │   ├── EmployeeDashboard.js
│   │   │   ├── ManagerDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── ApplyLeave.js
│   │   │   ├── MyLeaveHistory.js
│   │   │   ├── TeamLeaves.js
│   │   │   ├── LeaveBalance.js
│   │   │   └── LeaveTypesAdmin.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env
└── database/
    └── schema.sql
```

---

## 🔌 API Endpoints

| Method | Endpoint                          | Description     | Access   |
| ------ | --------------------------------- | --------------- | -------- |
| POST   | `/api/auth/login`                 | Login & get JWT | Public   |
| GET    | `/api/leave-types`                | Get leave types | Auth     |
| POST   | `/api/leave-requests`             | Apply leave     | Employee |
| GET    | `/api/leave-requests/my`          | My leaves       | Employee |
| GET    | `/api/leave-requests/team`        | Team requests   | Manager  |
| PUT    | `/api/leave-requests/:id/approve` | Approve leave   | Manager  |
| PUT    | `/api/leave-requests/:id/reject`  | Reject leave    | Manager  |
| DELETE | `/api/leave-requests/:id`         | Cancel request  | Employee |
| GET    | `/api/leave-balances/:employeeId` | View balance    | Auth     |
| POST   | `/api/leave-types`                | Add leave type  | Admin    |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/nivas-s-n/employee_leave_management.git
cd employee-leave-management
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```
---

## 🔄 Workflow

1. Employee applies for leave → Status = `Pending`
2. Manager reviews → `Approved` / `Rejected`
3. Leave balance updates automatically on approval
4. Admin manages Leave Types

---

## 📦 Deliverables

* ✅ Full-stack Leave Management System
* ✅ Role-based JWT Authentication
* ✅ Leave approval workflow
* ✅ MySQL database schema
* ✅ REST API

---

---

## 👨‍💻 Author

**Nivas Saravana**

* GitHub: https://github.com/nivas-s-n

---
