import { useState } from "react";
import CandidatePage from "./Candidate/CandidatePage";
import AuthentificationPage from "./Authentification/AuthentificationPage";
import { Routes, Route } from "react-router";
import { createContext } from "react";
import { AuthProvider } from "./Hooks";
import { Toaster } from "sonner";
import AdminPage from "./Admin/AdminPage";

export const AuthContext = createContext(null);

function App() {
  return (
    <AuthProvider context={AuthContext}>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/auth" element={<AuthentificationPage />} />
        <Route path="/candidate/*" element={<CandidatePage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
