# Account-management

## ✨ Introduction

Account-management is an internal web application designed to facilitate various administrative tasks within the company. The system incorporates multiple management functions, including:

- Meeting room booking system
- Kanban board for task management
- Job applicant management system
- Expense reimbursement system
- Vehicle booking system
- Leave request system
- Customer information management

The system follows a **Role-Based Access Control (RBAC)** mechanism, ensuring that different roles within the company have distinct functionalities. For example, HR Managers have the ability to create user accounts.

## 🛠️ Features

- **Role-Based Access Control (RBAC):** Different roles have different privileges.
- **CRUD Operations:** Every system module supports Create, Read, Update, and Delete actions.
- **Drag and Drop Support:** Available for job applicant management and task management (To-Do list).
- **Automated Employee Onboarding:** If an applicant passes the probationary period, a system account is automatically created.
- **Internal Email Creation:** Enables the automatic generation of company email accounts.

## ⚙️ Tech Stack

- **Frontend:** Next.js, React, Zustand, React Query
- **Backend:** Prisma, MongoDB, Elysia.js
- **Other Technologies:** Axios, TailwindCSS

## 🔧 Installation & Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (latest LTS version)
- MongoDB
- Git

### Steps

```bash
# Clone the repository
git clone https://github.com/your-repo/account-management.git
cd account-management

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory and configure necessary environment variables following `.env.example`.

## 🌟 Usage

After setting up the project, users can log in based on their assigned role to access specific functionalities:

- HR Managers: Manage employees and applicants
- Employees: Book meeting rooms, request leaves, and submit expense claims
- Admins: Oversee all system operations

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## 📢 License

This project is licensed under the MIT License.

## 💬 Contact & Support

For any inquiries or issues, please contact us via:

- Email: [support@yourcompany.com](mailto\:support@yourcompany.com)
- Discord: [https://discord.gg/your-community](https://discord.gg/your-community)

