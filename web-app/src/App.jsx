import { useState, useEffect } from 'react';
import { parseLogFile } from './utils/logProcessor';
import Dashboard from './components/Dashboard';
import TripDetail from './components/TripDetail';
import TripSelector from './components/TripSelector';

function App() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    fetch('/data/data-index.json')
      .then(res => res.json())
      .then(files => Promise.all(files.map(file => 
        fetch(`/data/${file}`).then(res => res.text()).then(text => parseLogFile(text))
      )))
      .then(data => setTrips(data));
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Sailing Logbook</h1>
      
      {trips.length > 0 && <Dashboard trips={trips} />}

      <TripSelector trips={trips} onSelect={setSelectedTrip} />

      {selectedTrip && <TripDetail trip={selectedTrip} />}
    </div>
  );
}

export default App;
