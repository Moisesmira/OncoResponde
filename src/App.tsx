import { Routes, Route } from 'react-router-dom';
import Today from './pages/Today';
import Voice from './pages/Voice';
import Answer from './pages/Answer';
import SimplePage from './pages/SimplePage';
import CancerProfile from './pages/CancerProfile';
import WellnessHub from './pages/WellnessHub';
import WellnessTopic from './pages/WellnessTopic';
import Breathing from './pages/Breathing';
import Tracking from './pages/Tracking';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Today />} />
      <Route path="/hablame" element={<Voice />} />
      <Route path="/respuesta" element={<Answer />} />
      <Route path="/oncoayuda" element={<SimplePage title="OncoAyuda" />} />
      <Route path="/perfil" element={<CancerProfile />} />
      <Route path="/cuidate" element={<WellnessHub />} />
      <Route path="/cuidate/:topicId" element={<WellnessTopic />} />
      <Route path="/respiracion" element={<Breathing />} />
      <Route path="/calma" element={<Breathing />} />
      <Route path="/seguimiento" element={<Tracking />} />
      <Route path="/camino" element={<SimplePage title="Mi Camino" />} />
      <Route path="/preparate" element={<SimplePage title="Prepárate" />} />
      <Route path="/familia" element={<SimplePage title="Familia" />} />
      <Route path="/fuentes" element={<SimplePage title="Fuentes fiables" />} />
      <Route path="/ajustes" element={<SimplePage title="Ajustes" />} />
    </Routes>
  );
}
