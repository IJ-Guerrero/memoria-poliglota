import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-400 sm:px-6">
          LinguaMatch — a memory game for learning languages. Built with React, Vite & Supabase.
        </div>
      </footer>
    </div>
  );
}
