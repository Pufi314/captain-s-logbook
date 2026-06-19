import { useState, useEffect, useMemo } from 'react';
import { parseLogFile, buildCityIndex, buildCrewIndex } from './utils/logProcessor';
import Dashboard from './components/Dashboard';
import TripDetail from './components/TripDetail';
import TripSelector from './components/TripSelector';
import CitySelector from './components/CitySelector';
import CityDetail from './components/CityDetail';
import CrewSelector from './components/CrewSelector';
import CrewDetail from './components/CrewDetail';
import { Compass } from 'lucide-react';
import bgImage from './assets/20240719_112113.jpg';

function App() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const cityIndex = useMemo(() => buildCityIndex(trips), [trips]);
  const crewIndex = useMemo(() => buildCrewIndex(trips), [trips]);

  useEffect(() => {
    fetch('/data/data-index.json')
      .then(res => res.json())
      .then(files => Promise.all(files.map(file => 
        fetch(`/data/${file}`).then(res => res.text()).then(text => parseLogFile(text))
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
        {trips.length > 0 && <Dashboard trips={trips} />}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Select a Voyage to View Logbook Details:</h2>
            <TripSelector trips={trips} value={selectedTrip ? trips.indexOf(selectedTrip).toString() : ''} onSelect={setSelectedTrip} />
          </div>
          {selectedTrip && (
            <div className="border-t pt-4">
              <TripDetail trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <CitySelector cityIndex={cityIndex} value={selectedCity ? selectedCity.name : ''} onSelect={(name) => setSelectedCity(name ? { name, data: cityIndex.get(name) } : null)} />
          {selectedCity && (
            <div className="border-t pt-4">
              <CityDetail city={selectedCity.name} data={selectedCity.data} onClose={() => setSelectedCity(null)} />
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <CrewSelector crewIndex={crewIndex} value={selectedCrew ? selectedCrew.name : ''} onSelect={(name) => setSelectedCrew(name ? { name, data: crewIndex.get(name) } : null)} />
          {selectedCrew && (
            <div className="border-t pt-4">
              <CrewDetail name={selectedCrew.name} data={selectedCrew.data} onClose={() => setSelectedCrew(null)} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
