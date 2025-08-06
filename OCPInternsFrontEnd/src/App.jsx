import { useState } from "react";
import CandidatePage from "./Candidate/CandidatePage";
import AuthentificationPage from "./Authentification/AuthentificationPage";
import { Routes, Route } from "react-router";
import { createContext } from "react";
import { AuthProvider } from "./Hooks";
import { Toaster } from "sonner";
import AdminPage from "./Admin/AdminPage";
import RecruiterPage from "./Recruiter/RecruiterPage";
import { RequireAuth } from "./Hooks";
import DocumentVerificationPage from "./DocumentVerfication/DocumentVerificationPage";

export const AuthContext = createContext(null);

function App() {
  return (
    <AuthProvider context={AuthContext}>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/auth" element={<AuthentificationPage />} />
        <Route path="/verify/:documentId" element={<DocumentVerificationPage />} />
        
        <Route element={<RequireAuth requiredRole="candidate" />}>
          <Route path="/candidate/*" element={<CandidatePage />} />
        </Route>

        <Route element={<RequireAuth requiredRole="admin" />}>
          <Route path="/admin/*" element={<AdminPage />} />
        </Route>

        <Route element={<RequireAuth requiredRole="recruiter" />}>
          <Route path="/recruiter/*" element={<RecruiterPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
