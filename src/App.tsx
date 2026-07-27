import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import PlayPage from '@/pages/PlayPage';
import CategoriesPage from '@/pages/CategoriesPage';
import LanguagesPage from '@/pages/LanguagesPage';
import SettingsPage from '@/pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/languages" element={<LanguagesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
