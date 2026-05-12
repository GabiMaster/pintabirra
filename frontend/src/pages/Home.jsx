import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Home() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [recomendaciones, setRecomendaciones] = useState({ bebidas: [], lugares: [] });

  useEffect(() => {
    api.get('/recomendaciones').then((res) => setRecomendaciones(res.data));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <p style={styles.saludo}>Buenas noches,</p>
          <h2 style={styles.nombre}>{usuario?.nombre}</h2>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Salir</button>
      </div>

      <nav style={styles.nav}>
        <button style={styles.navBtn} onClick={() => navigate('/lugares')}>Lugares</button>
        <button style={styles.navBtn} onClick={() => navigate('/bebidas')}>Bebidas</button>
        <button style={styles.navBtn} onClick={() => navigate('/amigos')}>Amigos</button>
        <button style={styles.navBtn} onClick={() => navigate('/perfil')}>Perfil</button>
      </nav>

      <section style={styles.seccion}>
        <h3 style={styles.tituloSeccion}>Recomendado para vos</h3>
        {recomendaciones.bebidas.length === 0 ? (
          <p style={styles.vacio}>Agregá preferencias en tu perfil para recibir recomendaciones</p>
        ) : (
          recomendaciones.bebidas.map((b) => (
            <div key={b.id} style={styles.card}>
              <p style={styles.cardNombre}>{b.nombre}</p>
              <p style={styles.cardDetalle}>{b.tipo} · {b.porcentaje_alcohol}% alc.</p>
            </div>
          ))
        )}
      </section>

      <section style={styles.seccion}>
        <h3 style={styles.tituloSeccion}>Lugares sugeridos</h3>
        {recomendaciones.lugares.length === 0 ? (
          <p style={styles.vacio}>No hay lugares sugeridos por ahora</p>
        ) : (
          recomendaciones.lugares.map((l) => (
            <div key={l.id} style={styles.card}>
              <p style={styles.cardNombre}>{l.nombre}</p>
              <p style={styles.cardDetalle}>{l.direccion}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#1C1A16', minHeight: '100vh', padding: '1.5rem', color: '#F5F0E8' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  saludo: { margin: 0, color: '#C47A1E', fontSize: '0.9rem' },
  nombre: { margin: 0, fontSize: '1.5rem' },
  logoutBtn: { backgroundColor: 'transparent', border: '1px solid #5C3A1E', color: '#C47A1E', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' },
  nav: { display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' },
  navBtn: { flex: 1, padding: '0.6rem', backgroundColor: '#5C3A1E', color: '#F5F0E8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  seccion: { marginBottom: '2rem' },
  tituloSeccion: { color: '#C47A1E', marginBottom: '1rem' },
  card: { backgroundColor: '#2a2620', padding: '1rem', borderRadius: '8px', marginBottom: '0.75rem' },
  cardNombre: { margin: 0, fontWeight: 'bold' },
  cardDetalle: { margin: '0.25rem 0 0', color: '#C47A1E', fontSize: '0.85rem' },
  vacio: { color: '#9a9690', fontSize: '0.9rem' },
};