import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@/lib/i18n';
import { AuthProvider } from '@/features/profile/AuthContext';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { HomePage } from '@/pages/HomePage';
import { DiagnosePage } from '@/pages/DiagnosePage';
import { ChatPage } from '@/pages/ChatPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { WeatherPage } from '@/pages/WeatherPage';
import { ExpertPage } from '@/pages/ExpertPage';
import { AdminPage } from '@/pages/AdminPage';
import { AuthPage } from '@/pages/AuthPage';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-200">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/diagnose" element={<DiagnosePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/expert" element={<ExpertPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
