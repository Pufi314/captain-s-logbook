import { useState, useEffect, useMemo } from 'react';
import { parseLogFile, buildPlaceIndex, buildCrewIndex } from './utils/logProcessor';
import Dashboard from './components/Dashboard';
import TripDetail from './components/TripDetail';
import TripSelector from './components/TripSelector';
import PlaceSelector from './components/PlaceSelector';
import PlaceDetail from './components/PlaceDetail';
import CrewSelector from './components/CrewSelector';
import CrewDetail from './components/CrewDetail';
import { Compass } from 'lucide-react';
import bgImage from './assets/20240719_112113.jpg';

function App() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [placeFilter, setPlaceFilter] = useState('overnightCity');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    requestAnimationFrame(() => {
      document.getElementById('voyage-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  };
  const handlePlaceSelect = (name, filterKey) => {
    setPlaceFilter(filterKey);
    setSelectedPlace({ name, data: null });
    requestAnimationFrame(() => {
      document.getElementById('place-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  };
  const handleCrewSelect = (name) => {
    setSelectedCrew({ name, data: crewIndex.get(name) });
    requestAnimationFrame(() => {
      document.getElementById('crew-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  };
  const placeIndex = useMemo(() => buildPlaceIndex(trips, placeFilter), [trips, placeFilter]);
  const crewIndex = useMemo(() => buildCrewIndex(trips), [trips]);

  useEffect(() => {
    fetch('data/data-index.json')
      .then(res => res.json())
      .then(files => Promise.all(files.map(file => 
        fetch(`data/${file}`).then(res => res.text()).then(text => parseLogFile(text))
      )))
      .then(data => setTrips(data));
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bgImage})` }}>
      <header className="bg-[#1a365d] text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Compass className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Captain's Logbook Dashboard</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {trips.length > 0 && <Dashboard trips={trips} onTripSelect={handleTripSelect} />}

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Explore</h2>
          <div className="space-y-4">

        <div id="voyage-section" className="bg-white/80 p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Select a Voyage</h2>
            <TripSelector trips={trips} value={selectedTrip ? trips.indexOf(selectedTrip).toString() : ''} onSelect={setSelectedTrip} />
          </div>
          {selectedTrip && (
            <div className="border-t pt-4">
              <TripDetail trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
            </div>
          )}
        </div>

        <div id="place-section" className="bg-white/80 p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <PlaceSelector placeIndex={placeIndex} filterKey={placeFilter} onFilterChange={(key) => { setPlaceFilter(key); setSelectedPlace(null); }} value={selectedPlace ? selectedPlace.name : ''} onSelect={(name) => setSelectedPlace(name ? { name, data: placeIndex.get(name) } : null)} />
          {selectedPlace && (
            <div className="border-t pt-4">
              <PlaceDetail place={selectedPlace.name} data={selectedPlace.data || placeIndex.get(selectedPlace.name)} onClose={() => setSelectedPlace(null)} onTripSelect={handleTripSelect} onCrewSelect={handleCrewSelect} />
            </div>
          )}
        </div>

        <div id="crew-section" className="bg-white/80 p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <CrewSelector crewIndex={crewIndex} value={selectedCrew ? selectedCrew.name : ''} onSelect={(name) => setSelectedCrew(name ? { name, data: crewIndex.get(name) } : null)} />
          {selectedCrew && (
            <div className="border-t pt-4">
              <CrewDetail name={selectedCrew.name} data={selectedCrew.data} onClose={() => setSelectedCrew(null)} onTripSelect={handleTripSelect} onPlaceSelect={handlePlaceSelect} />
            </div>
          )}
        </div>
        </div>
        </section>
      </main>
    </div>
  );
}

export default App;
