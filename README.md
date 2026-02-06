# CloudDrive Frontend

A modern, responsive cloud storage interface built with React. Features a Google Drive-like experience with drag-and-drop uploads, folder navigation, and real-time file management.

## 🚀 Live Demo

- **Frontend**: https://clouddrive-red.vercel.app
- **Backend API**: https://googledrive-backend-4lxu.onrender.com

## ✨ Features

### User Interface
- 🎨 Modern, clean design inspired by Google Drive
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌙 Smooth animations with Framer Motion
- 📋 List and Grid view modes
- 🔍 Sort and filter files
- ⌨️ Multi-select with Ctrl/Cmd click

### File Management
- 📤 Drag-and-drop file upload
- 📁 Folder upload with structure preservation
- 📂 Infinite folder nesting
- ⭐ Star/unstar files
- 🗑️ Trash with restore functionality
- 📥 Secure file downloads
- ✏️ Rename files and folders

### Authentication
- 🔐 Secure login/register
- 📧 Email verification
- 🔑 Password reset
- 🍪 Persistent sessions

### Real-time Features
- 📊 Upload progress tracking
- 🔄 Live file list updates
- 💫 Loading skeletons
- 🔔 Toast notifications

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build tool |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| Zustand | State management |
| React Router 7 | Navigation |
| Axios | HTTP client |
| Radix UI | Accessible components |
| Lucide React | Icons |
| React Hook Form + Zod | Form handling |

## 📁 Project Structure

```
googledrive-frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── vercel.json              # Vercel deployment config
└── src/
    ├── main.jsx             # React entry point
    ├── App.jsx              # Router & layout
    ├── index.css            # Global styles & CSS variables
    ├── routes/
    │   └── routes.js        # Route constants
    ├── layouts/
    │   └── ProtectedLayout.jsx  # Main dashboard layout
    ├── pages/
    │   ├── auth/            # Login, Register, Reset, Verify
    │   ├── protected/       # Dashboard, MyDrive, Trash, etc.
    │   ├── public/          # Landing page
    │   └── error/           # 404, Unauthorized
    ├── components/
    │   ├── ui/              # Radix-based UI components
    │   └── shared/          # FileListView, dialogs, etc.
    ├── services/
    │   ├── api.js           # Axios instance
    │   ├── authService.js   # Auth API calls
    │   └── api/             # filesAPI, storageAPI
    ├── stores/
    │   ├── useAuthStore.js  # Auth state
    │   ├── uploadStore.js   # Upload progress
    │   └── ...
    ├── hooks/
    │   ├── useFileUpload.jsx    # Upload logic
    │   └── useDriveItems.jsx    # File list logic
    ├── constants/
    │   └── appConstants.js  # Data types
    └── lib/
        └── utils.js         # Utilities
```

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/BudraHH/googledrive-frontend.git
   cd googledrive-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Environment Variables

Create a `.env` file:

```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production (set in Vercel dashboard)
VITE_API_URL=https://googledrive-backend-4lxu.onrender.com/api
```

## 📱 Pages & Routes

### Public Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/` | LandingPage | Marketing homepage |
| `/login` | LoginPage | User login |
| `/register` | SignUpPage | User registration |
| `/forgot-password` | ForgotPasswordPage | Password reset request |
| `/reset-password/:token` | ResetPasswordPage | Set new password |
| `/verify-email` | VerifyEmailPage | Email verification |

### Protected Routes (requires login)
| Path | Component | Description |
|------|-----------|-------------|
| `/drive/home` | HomePage | Dashboard with suggestions |
| `/drive/my-drive` | MyDrivePage | Root folder view |
| `/drive/folders/:folderId` | FolderPage | Subfolder view |
| `/drive/recent` | RecentPage | Recently accessed |
| `/drive/starred` | StarredPage | Starred items |
| `/drive/trash` | TrashPage | Deleted items |
| `/file/d/:fileId/view` | FilePreviewPage | File preview |

## 🎨 Design System

### Colors (CSS Variables)
```css
--primary: 202 80% 16%;      /* Dark blue */
--secondary: 199 89% 48%;    /* Bright blue */
--background: 210 40% 98%;   /* Light gray */
--destructive: 0 84.2% 60.2%; /* Red */
```

### Components
- Built on **Radix UI** for accessibility
- Styled with **TailwindCSS**
- Custom components in `/components/ui/`

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `VITE_API_URL` = `https://googledrive-backend-4lxu.onrender.com/api`
4. Deploy!

### vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This enables client-side routing for React Router.

## 📊 Key Features Explained

### Drag & Drop Upload
The `useFileUpload` hook handles:
- Single/multiple file drops
- Folder uploads with structure preservation
- Concurrent upload queue (5 files at a time)
- Progress tracking per file
- Automatic folder creation

### State Management
Uses **Zustand** for:
- `useAuthStore`: User session, sidebar state
- `uploadStore`: Upload queue with progress
- `actionStore`: Loading indicators
- `usePreviewStore`: File preview modal

### File Icons
Automatic icon selection based on:
1. `DATA_TYPES` enum from backend
2. File extension fallback
3. MIME type detection

## 🧪 Development

```bash
# Start dev server
npm run dev

# Lint code
npm run lint

# Build
npm run build

# Preview production build
npm run preview
```

## 📄 License

ISC License

## 👨‍💻 Author

Built for HCL-GUVI Hackathon 2026
