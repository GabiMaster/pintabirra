import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Lugares from './pages/Lugares';
import Bebidas from './pages/Bebidas';
import Amigos from './pages/Amigos';
import Perfil from './pages/Perfil';

function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lugares"
            element={
              <ProtectedRoute>
                <Lugares />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bebidas"
            element={
              <ProtectedRoute>
                <Bebidas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/amigos"
            element={
              <ProtectedRoute>
                <Amigos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;