# Project Similarity Checker

A powerful web application that uses advanced NLP and AI techniques to detect similarities between project proposals, helping maintain academic integrity and prevent duplication.

## Features

- **AI-Powered Analysis**: Advanced NLP algorithms analyze project proposals to detect similarities with existing submissions
- **Real-time Processing**: Instant feedback on project similarity with existing submissions
- **Bulk Upload Support**: Upload and analyze multiple projects simultaneously
- **Customizable Thresholds**: Set specific similarity thresholds based on your institution's requirements
- **Detailed Reports**: Get comprehensive similarity reports with percentage matches and source references
- **Role-based Access**: Different access levels for students, administrators, and super-administrators
- **Session Management**: Create and manage multiple project submission sessions
- **Email Verification**: Secure user registration with email verification
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js
- **Email Service**: Nodemailer
- **Form Handling**: React Hook Form, Zod validation
- **UI Components**: Custom components with Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance (local or Atlas)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# App
NEXT_PUBLIC_URL=http://localhost:3000
SERVER_MODE=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=your_database_name

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000

# Email (Gmail)
EMAIL_ID=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

# JWT
JWT_SECRET=your_jwt_secret

# API
NEXT_PUBLIC_SIMILARITY_API_ENDPOINT_BASE_URL=your_similarity_api_endpoint
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/project-similarity-checker.git
cd project-similarity-checker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── session/           # Session management
│   └── user-management/   # User management
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── models/               # MongoDB models
├── public/               # Static assets
└── server-actions/       # Server-side actions
```

## Key Features Explained

### Session Management
- Create new sessions with customizable thresholds
- Add co-administrators to help manage sessions
- Bulk upload projects via CSV
- Export session data to CSV

### Project Submission
- Submit individual projects with title and abstract
- Real-time similarity checking
- Automatic status updates based on similarity threshold
- Detailed similarity reports

### User Management
- Role-based access control
- Email verification for new users
- Profile management
- Super-admin controls for role management

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
