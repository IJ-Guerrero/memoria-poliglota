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
          Memoria Políglota — un juego de memoria diseñado para aprender idiomas de forma divertida y dinámica. Desarrollado con React y Vite.
        </div>
      </footer>
    </div>
  );
}
