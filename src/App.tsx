import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import HammaddePage from "./pages/HammaddePage";
import RecetePage from "./pages/RecetePage";
import MaliyetPage from "./pages/MaliyetPage";

function MainApp() {
  const { isAuthenticated, logout } = useAuth();
  const [page, setPage] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash || 'hammadde';
  });

  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && ['hammadde', 'recete', 'maliyet'].includes(hash)) {
        setPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-6">
      <nav className="bg-orange-400 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${page === "hammadde" ? "bg-orange-500" : "hover:bg-orange-500"}`}
              onClick={() => setPage("hammadde")}
            >
              Hammadde
            </button>
            <button
              className={`px-4 py-2 rounded ${page === "recete" ? "bg-orange-500" : "hover:bg-orange-500"}`}
              onClick={() => setPage("recete")}
            >
              Reçete
            </button>
            <button
              className={`px-4 py-2 rounded ${page === "maliyet" ? "bg-orange-500" : "hover:bg-orange-500"}`}
              onClick={() => setPage("maliyet")}
            >
              Maliyet
            </button>
          </div>
          <button
            className="px-4 py-2 rounded hover:bg-orange-500 bg-orange-600"
            onClick={logout}
          >
            Çıkış
          </button>
        </div>
      </nav>
      <div className="container mx-auto p-4 pb-8">
        {page === "hammadde" && <HammaddePage />}
        {page === "recete" && <RecetePage />}
        {page === "maliyet" && <MaliyetPage />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}