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
import SymptomDiary from './pages/SymptomDiary';
import Relaxation from './pages/Relaxation';
import Prepare from './pages/Prepare';
import Treatment from './pages/Treatment';
import Reports from './pages/Reports';
import Medication from './pages/Medication';
import Consultation from './pages/Consultation';
import Camino from './pages/Camino';
import Family from './pages/Family';
import Sources from './pages/Sources';
import AppFooter from './components/AppFooter';

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
      <Route path="/" element={<Today />} />
      <Route path="/hablame" element={<Voice />} />
      <Route path="/respuesta" element={<Answer />} />
      <Route path="/oncoayuda" element={
        <SimplePage title="OncoAyuda">
          <div className="oncoayuda-intro">
            <div className="oncoayuda-intro__icon" aria-hidden="true">🤝</div>
            <div>
              <h2>Apoyo para comprender y avanzar</h2>
              <p>OncoAyuda reúne recursos para ayudarte a comprender mejor tu enfermedad, prepararte para los tratamientos y resolver dudas frecuentes.</p>
              <p>Siempre que lo necesites, utiliza <strong>Háblame</strong> para realizar una consulta personalizada.</p>
            </div>
          </div>
        </SimplePage>
      } />
      <Route path="/perfil" element={<CancerProfile />} />
      <Route path="/cuidate" element={<WellnessHub />} />
      <Route path="/cuidate/:topicId" element={<WellnessTopic />} />
      <Route path="/respiracion" element={<Breathing />} />
      <Route path="/relajate" element={<Relaxation />} />
      <Route path="/calma" element={<Breathing />} />
      <Route path="/seguimiento" element={<Tracking />} />
      <Route path="/seguimiento/sintomas" element={<SymptomDiary />} />
      <Route path="/camino" element={<Camino />} />
      <Route path="/preparate" element={<Prepare />} />
      <Route path="/tratamiento" element={<Treatment />} />
      <Route path="/medicacion" element={<Medication />} />
      <Route path="/consulta" element={<Consultation />} />
      <Route path="/informes" element={<Reports />} />
      <Route path="/familia" element={<Family />} />
      <Route path="/fuentes" element={<Sources />} />
      <Route path="/ajustes" element={<SimplePage title="Ajustes y privacidad" />} />
      </Routes>
      <AppFooter />
    </div>
  );
}
