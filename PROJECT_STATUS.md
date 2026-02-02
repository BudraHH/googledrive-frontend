# Google Drive Clone - Frontend Project Status

This document provides a comprehensive overview of the current state of the frontend application. It outlines the implemented pages, key features, and technical limitations regarding backend validation and cloud storage integration.

## 🚀 Key Features

### 🖥️ User Interface & Experience
- **Responsive Design**: Fully responsive layout adapting to Desktop, Tablet, and Mobile screens.
- **Google Drive Aesthetic**: Meticulously styled using **Tailwind CSS** to match the visual language of Google Drive (Slate grays, Google Sans-like typography, clean whitespace).
- **View Modes**: Toggle between **List View** and **Grid View** for all file pages.
- **Sidebar Navigation**: Collapsible sidebar with navigation to all major sections (My Drive, Recent, Starred, Spal, Trash, Storage).

### 📂 File Management
- **File/Folder Uploads**:
  - **Drag & Drop**: Global drag-and-drop zone with visual overlay.
  - **Custom Dialogs**: Styled `FileUploadDialog` and `FolderUploadDialog` with preview cards and metadata (size, file count).
- **Organization**:
  - **Sorting**: Sort by Name, Owner, Date Modified, and Size.
  - **Filtering**: Filter contents by Type (PDF, Image, Folder), Person, Modified Date, and Source.
  - **Selection**: Multi-select capability with a context toolbar.
- **Context Actions**:
  - Right-click or "More" menu options (Rename, Download, Share, Star, Move to Trash).
  - **New Folder**: Modal dialog to create new folders.

### ⚙️ Technical Components
- **State Management**: Uses **Zustand** stores (`useAuthStore`, `useAgentStore`, `useNotificationStore`) for global state.
- **Routing**: **React Router v6** with protected route guards for authentication.
- **Icons**: Extensive use of **Lucide React** icons.
- **UI Components**: Custom-built components integrated with Radix UI primitives (shadcn/ui patterns).

---

## 📄 Application Pages

### 🔐 Protected (User Dashboard)
| Page | Route | Description |
|------|-------|-------------|
| **Home (Dashboard)** | `/drive/home` | Overview of suggested files and recent activity. |
| **My Drive** | `/drive/my-drive` | The main file browser. Displays folders and files with full sorting/filtering. |
| **Recent** | `/drive/recent` | Chronological list of recently accessed files. Includes "Source" filtering. |
| **Starred** | `/drive/starred` | List of important files marked as favorites. |
| **Spam** | `/drive/spam` | Dedicated trash/spam folder. Currently shows a text-only empty state if no spam exists. |
| **Trash (Bin)** | `/drive/trash` | Recycle bin functionality with "Restore" and "Delete Forever" concepts. |

### 🌍 Public / Auth
- **Landing Page**: `/`
- **Login**: `/login`
- **Sign Up**: `/register`
- **Forgot Password**: `/forgot-password`
- **Reset Password**: `/reset-password/:token`
- **Verify Email**: `/verify-email`
- **Error Pages**: 404 Not Found, 401 Unauthorized

---

## ⚠️ Current Limitations & Backend Status

**Crucial Note:** This application is currently a **Frontend-Only Prototype**.

1.  **Mock Data**:
    -   All files and folders displayed are generated from static mock data (`src/constants/mockData.js`).
    -   There is **no persistent database connection**. Refreshing the page will reset locally made changes (unless persisted in localStorage, which is minimal).

2.  **No Real Authenitcation**:
    -   Authentication flows (Login/Signup) simulate success but do not communicate with a real Identity Provider (Auth0, Firebase, or custom backend).

3.  **Mocked AWS S3 Storage**:
    -   The `storageAPI.js` service **simulates** file uploads to AWS S3.
    -   It mimics network latency and progress bars but **does not actually upload files** to a cloud bucket.
    -   "Downloads" are simulated links.

4.  **No Backyard API**:
    -   No Express/Node.js or Python backend is currently running.
    -   API calls are intercepted or mocked directly in the frontend service layer.

---

## 🛠 Next Steps for Development
To transition this from a prototype to a fully functional application, the following backend integrations are needed:
1.  **Set up a Database** (MongoDB/PostgreSQL) and REST API to replace `mockData.js`.
2.  **Integrate Authentication** (JWT/OAuth) to replace mock auth.
3.  **Configure AWS S3** bucket and replace `storageAPI.js` mock functions with real Presigned URL upload logic.
