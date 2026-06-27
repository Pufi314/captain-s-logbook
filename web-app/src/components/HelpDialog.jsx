import { X, Compass, Users, LayoutDashboard, Ship, MapPin, User, Route, FileText } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

function HelpDialog({ isOpen, onClose }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Compass className="w-6 h-6 text-[#1a365d]" />
            {t("Captain's Logbook Dashboard")}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label={t('Close help')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {t('A web app for browsing, exploring, and visualizing sailing trip logs from the Adriatic Sea. Switch between logbooks, dive into daily logs with interactive maps, and discover patterns across voyages.')}
        </p>

        <div className="space-y-4">
          <FeatureItem
            icon={<Users className="w-5 h-5 text-blue-600" />}
            title={t('Captain Selector')}
            desc={t("Switch between Michal's and Ondřej's logbooks. Each captain has their own set of trips, GPX routes, and statistics. The icon in the header shows the active captain's initial.")}
          />

          <FeatureItem
            icon={<LayoutDashboard className="w-5 h-5 text-blue-600" />}
            title={t('Dashboard')}
            desc={t('Summary cards show total nautical miles, hours under way, sail vs motor percentages, and mooring type breakdown. Record tiles highlight the longest trips and biggest sailing days — click any record to jump to that voyage.')}
          />

          <FeatureItem
            icon={<Ship className="w-5 h-5 text-blue-600" />}
            title={t('Voyages')}
            desc={t("Select a trip from the dropdown to view its metadata — boat, crew, captain, dates, price. The daily log table shows distance, time, sailing stats, stops, and overnight locations. Clicking a day opens an interactive map with a marker at that location.")}
          />

          <FeatureItem
            icon={<Route className="w-5 h-5 text-blue-600" />}
            title={t('GPX Route Overlay')}
            desc={t("When available, a toggle button in the map's top-right corner overlays the day's GPS route as a blue polyline. Fly smoothly between the marker view and the full route.")}
          />

          <FeatureItem
            icon={<MapPin className="w-5 h-5 text-blue-600" />}
            title={t('Places')}
            desc={t('Browse overnight stays filtered by island, city, or bay. Each place shows a chronological list of visits and the crew members who stayed there. Click a visit to open that voyage, or click a crew badge to see their trips.')}
          />

          <FeatureItem
            icon={<User className="w-5 h-5 text-blue-600" />}
            title={t('Crew')}
            desc={t("Select any crew member to see all their trips and the places they've visited. Click a trip to view its detail, or click a place badge to explore it.")}
          />

          <FeatureItem
            icon={<FileText className="w-5 h-5 text-blue-600" />}
            title={t('PDF Export')}
            desc={t("Export a trip summary to PDF including an overview map with all daily markers and GPX routes, full metadata, and the daily log table. A loading overlay covers the page during generation.")}
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 space-y-1.5 border border-gray-100">
          <p className="font-medium text-gray-700">{t('Navigation Tips')}</p>
          <ul className="list-disc list-inside space-y-1">
            <li>{t('Selecting a trip, place, or crew member hides the other two sections')}</li>
            <li>{t('Click blue links (dates, crew names, place names) to navigate between related sections')}</li>
            <li>{t('Click the X button on any detail panel to collapse it')}</li>
            <li>{t('Switching captains resets all selections')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="font-medium text-gray-800 text-sm">{title}</p>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default HelpDialog;
