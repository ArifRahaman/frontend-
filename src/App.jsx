// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Only import what we actually have for now
// import Signup from "./components/auth/Signup";

// // Temporary Navbar
// const Navbar = () => {
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     toast.info("Logged out");
//     window.location.href = "/";
//   };

//   return (
//     <nav
//       style={{
//         padding: 12,
//         borderBottom: "1px solid #eee",
//         display: "flex",
//         gap: 12,
//       }}
//     >
//       <a href="/" style={{ fontWeight: "bold" }}>
//         Brand
//       </a>
//       <a href="/">Home</a>
//       {user ? (
//         <>
//           <a href="/create">Create</a>
//           <a href="/profile">{user.username || "Profile"}</a>
//           <button onClick={handleLogout} style={{ marginLeft: 8 }}>
//             Logout
//           </button>
//         </>
//       ) : (
//         <>
//           <a href="/login">Login</a>
//           <a href="/signup">Signup</a>
//         </>
//       )}
//     </nav>
//   );
// };

// export default function App() {
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="colored"
//       />

//       <BrowserRouter>
//         <Navbar />
//         <main style={{ padding: 16 }}>
//           <Routes>
//             <Route path="/signup" element={<Signup />} />
//           </Routes>
//         </main>
//       </BrowserRouter>
//     </>
//   );
// }
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost"; // <-- import
import PostsList from "./components/posts/PostList"; // ✅ Use the real posts list
import Navbar from "./components/ui/Navbar"; // ✅ Use the real navbar
import PostView from "./components/posts/PostView"; // ✅ Use the real post view
import Profile from "./pages/Profile";
import Chatai from "./components/chatai/Chatai"; // ✅ Use the real Chatai component
import HomePage from "./pages/Home";
export default function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <BrowserRouter>
        <Navbar /> {/* ✅ Real Navbar */}
        <main className="p-0 pt-16">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <PostsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chatai />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:slug"
              element={
                <ProtectedRoute>
                  <PostView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* <Route>
              <Route path="/posts/:slug" element={<PostView />} />
            </Route> */}
          </Routes>

        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
