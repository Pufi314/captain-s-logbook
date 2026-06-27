import { useState, useEffect, useMemo, useRef } from 'react';
import { parseLogFile, buildPlaceIndex, buildCrewIndex } from './utils/logProcessor';
import Dashboard from './components/Dashboard';
import TripDetail from './components/TripDetail';
import TripSelector from './components/TripSelector';
import PlaceSelector from './components/PlaceSelector';
import PlaceDetail from './components/PlaceDetail';
import CrewSelector from './components/CrewSelector';
import CrewDetail from './components/CrewDetail';
import { Compass, HelpCircle, Languages } from 'lucide-react';
import HelpDialog from './components/HelpDialog';
import { useTranslation } from './i18n/LanguageContext';

const CAPTAINS = [
  { key: 'michal', label: 'Michal', initial: 'M', fullName: 'Michal Puffler' },
  { key: 'ondrej', label: 'Ondrej', initial: 'O', fullName: 'Ondrej Puffler' },
];

function App() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [placeFilter, setPlaceFilter] = useState('overnightCity');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [captain, setCaptain] = useState('michal');
  const [captainDropdownOpen, setCaptainDropdownOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const captainRef = useRef(null);

  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (captainRef.current && !captainRef.current.contains(e.target)) {
        setCaptainDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedTrip(null);
    setSelectedPlace(null);
    setSelectedCrew(null);
  }, [captain]);

  const currentCaptain = CAPTAINS.find(c => c.key === captain);
  const { t, language, toggleLanguage } = useTranslation();

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
    const dataDir = `data/${captain}`;
    fetch(`${dataDir}/data-index.json`)
      .then(res => res.json())
      .then(files => Promise.all(files.map(file => {
        const csvFile = file.replace('.csv', '');
        return fetch(`${dataDir}/${file}`).then(res => res.text()).then(text => ({ ...parseLogFile(text), csvFile }));
      })))
      .then(data => setTrips(data));
  }, [captain]);

  return (
    <div className="min-h-screen">
        <header className="bg-[#1a365d] text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Compass className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{t("Captain's Logbook Dashboard")}</h1>
          <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setHelpDialogOpen(true)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label={t('Help')}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={toggleLanguage}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold hover:bg-white/30 transition-colors"
            aria-label={language === 'en' ? 'Switch to Slovak' : 'Prepnúť na angličtinu'}
          >
            {language === 'en' ? 'EN' : 'SK'}
          </button>
          <div className="relative" ref={captainRef}>
            <button
              onClick={() => setCaptainDropdownOpen(!captainDropdownOpen)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold hover:bg-white/30 transition-colors"
              aria-label={t('Switch captain')}
            >
              {currentCaptain?.initial}
            </button>
            {captainDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px] z-50">
                {CAPTAINS.map(c => (
                  <button
                    key={c.key}
                    onClick={() => { setCaptain(c.key); setCaptainDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm ${c.key === captain ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {trips.length > 0 && <Dashboard trips={trips} onTripSelect={handleTripSelect} captainName={currentCaptain.fullName} />}

        <section>
          <h2 className="text-xl font-bold text-white mb-4">{t('Explore')}</h2>
          <div className="space-y-4">

        <div id="voyage-section" className="bg-white/60 p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{t('Select a Voyage')}</h2>
            <TripSelector trips={trips} value={selectedTrip ? trips.indexOf(selectedTrip).toString() : ''} onSelect={(trip) => { setSelectedTrip(trip); setSelectedPlace(null); setSelectedCrew(null); }} />
          </div>
          {selectedTrip && (
            <div className="border-t pt-4">
              <TripDetail key={selectedTrip.metadata.tripId} trip={selectedTrip} csvFile={selectedTrip.csvFile} onClose={() => setSelectedTrip(null)} captain={captain} />
            </div>
          )}
        </div>

        <div id="place-section" className="bg-white/60 p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <PlaceSelector placeIndex={placeIndex} filterKey={placeFilter} onFilterChange={(key) => { setPlaceFilter(key); setSelectedPlace(null); }} value={selectedPlace ? selectedPlace.name : ''} onSelect={(name) => { setSelectedPlace(name ? { name, data: placeIndex.get(name) } : null); setSelectedTrip(null); setSelectedCrew(null); }} />
          {selectedPlace && (
            <div className="border-t pt-4">
              <PlaceDetail place={selectedPlace.name} data={selectedPlace.data || placeIndex.get(selectedPlace.name)} onClose={() => setSelectedPlace(null)} onTripSelect={handleTripSelect} onCrewSelect={(name) => { setSelectedPlace(null); setSelectedTrip(null); handleCrewSelect(name); }} />
            </div>
          )}
        </div>

        <div id="crew-section" className="bg-white/60 p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <CrewSelector crewIndex={crewIndex} value={selectedCrew ? selectedCrew.name : ''} onSelect={(name) => { setSelectedCrew(name ? { name, data: crewIndex.get(name) } : null); setSelectedTrip(null); setSelectedPlace(null); }} />
          {selectedCrew && (
            <div className="border-t pt-4">
              <CrewDetail name={selectedCrew.name} data={selectedCrew.data} onClose={() => setSelectedCrew(null)} onTripSelect={handleTripSelect} onPlaceSelect={(name, filterKey) => { setSelectedCrew(null); setSelectedTrip(null); handlePlaceSelect(name, filterKey); }} />
            </div>
          )}
        </div>
        </div>
        </section>
      </main>
      <HelpDialog isOpen={helpDialogOpen} onClose={() => setHelpDialogOpen(false)} />
    </div>
  );
}
export default App;
