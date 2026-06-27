import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FileText } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

const parseGPX = (gpxText) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxText, 'text/xml');
  const trkpts = xml.querySelectorAll('trkpt');
  return Array.from(trkpts).map(pt => [
    parseFloat(pt.getAttribute('lat')),
    parseFloat(pt.getAttribute('lon')),
  ]);
};

const dayIcon = (num) => L.divIcon({
  className: '',
    html: `<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="#1a365d" stroke="white" stroke-width="2"/><text x="13" y="14" text-anchor="middle" dominant-baseline="central" fill="white" font-size="12" font-weight="bold" font-family="sans-serif">${num}</text></svg>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

function TileLoader({ onReady }) {
  const map = useMap();
  useEffect(() => {
    map.whenReady(() => {
      map.invalidateSize();
      let loaded = 0;
      let total = 0;
      const check = () => { if (loaded >= total) onReady(); };
      map.on('tileloadstart', () => { total++; });
      map.on('tileload', () => { loaded++; check(); });
      map.on('tileerror', () => { loaded++; check(); });
      setTimeout(() => onReady(), 3000);
    });
  }, [map]);
  return null;
}

function ExportPdfButton({ trip, csvFile, captain, onClose }) {
  const { t, translateTitle } = useTranslation();
  const [exporting, setExporting] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [gpxData, setGpxData] = useState({});
  const [mapReady, setMapReady] = useState(false);
  const exportRef = useRef(null);


  const { metadata, dailyLogs } = trip;
  const locations = dailyLogs
    .filter(log => log.location && log.location !== 'N/A')
    .map(log => {
      const [lat, lng] = log.location.split(',').map(parseFloat);
      return { lat, lng, day: log.day, date: log.date, location: log.location };
    });

  const handleExport = useCallback(async () => {
    setExporting(true);
    setShowExport(true);
    setMapReady(false);
    setGpxData({});

    // Fetch all GPX files
    const dataDir = `data/${captain}`;
    const gpxResults = {};
    const fetches = locations.map(async (loc) => {
      const gpxUrl = `${dataDir}/gpx/${csvFile}_day_${loc.day}.gpx`;
      try {
        const res = await fetch(gpxUrl);
        if (res.ok) {
          const text = await res.text();
          const coords = parseGPX(text);
          if (coords.length > 0) gpxResults[loc.day] = coords;
        }
      } catch {}
    });
    await Promise.all(fetches);
    setGpxData(gpxResults);

    setTimeout(async () => {
      await new Promise(r => setTimeout(r, 500));

      try {
        const el = exportRef.current;
        if (!el) return;

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 1123,
          windowWidth: 1123,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfW = 297;
        const pdfH = 210;
        const imgW = canvas.width;
        const imgH = canvas.height;
        const ratio = imgW / imgH;
        let pageH = pdfW / ratio;

        if (pageH <= pdfH) {
          pdf.addImage(imgData, 'JPEG', 0, (pdfH - pageH) / 2, pdfW, pageH);
        } else {
          const table = el.querySelector('table');
          const tableTopPx = table ? (table.getBoundingClientRect().top - el.getBoundingClientRect().top) : 0;
          const tableTopCanvas = tableTopPx * 2;
          const ROW_H_CANVAS = 60;

          const pageCanvasH = pdfH * (imgW / pdfW);
          let y = 0;
          let page = 0;
          while (y < imgH) {
            if (page > 0) pdf.addPage();
            let h = Math.min(pageCanvasH, imgH - y);
            if (y + h < imgH && y + h > tableTopCanvas + 50) {
              const inTable = y + h - tableTopCanvas;
              const rowsFit = Math.max(0, Math.floor(inTable / ROW_H_CANVAS));
              const snapY = tableTopCanvas + rowsFit * ROW_H_CANVAS;
              if (snapY > y && snapY - y > 50) {
                h = snapY - y;
              }
            }
            h = Math.min(h, imgH - y);
            if (h <= 0) break;
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = imgW;
            pageCanvas.height = h;
            const ctx = pageCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, y, imgW, h, 0, 0, imgW, h);
            const pageImg = pageCanvas.toDataURL('image/jpeg', 0.92);
            const pageContentH = h * (pdfW / imgW);
            pdf.addImage(pageImg, 'JPEG', 0, 0, pdfW, pageContentH);
            y += h;
            page++;
          }
        }

        const pdfDataUri = pdf.output('datauri', { filename: `${csvFile}-summary.pdf` });
        window.open(pdfDataUri, '_blank');
      } catch (err) {
        console.error('PDF export failed:', err);
      }

      setShowExport(false);
      setExporting(false);
    }, 100);
  }, [trip, csvFile, captain, locations]);

  const totalDist = dailyLogs.reduce((s, l) => s + (l.totalDistanceNm || 0), 0);
  const totalMin = dailyLogs.reduce((s, l) => s + (l.totalTimeMinutes || 0), 0);
  const sailsDist = dailyLogs.reduce((s, l) => s + (l.sailsDistanceNm || 0), 0);
  const sailsMin = dailyLogs.reduce((s, l) => s + (l.sailsTimeMinutes || 0), 0);

  return (
    <>
      <button
        onClick={handleExport}
        disabled={exporting}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1 text-gray-500 hover:text-gray-700"
        title={t('Export PDF')}
      >
        <FileText className="w-5 h-5" />
      </button>

      {showExport && createPortal(
        <>
        <div style={{ position: 'fixed', top: 0, left: 0, width: 1123, zIndex: 1, pointerEvents: 'none' }} ref={exportRef}>
          <div style={{ background: 'white', padding: '20px 30px', fontFamily: 'sans-serif', color: '#333' }}>
            <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: '0 0 4px', color: '#1a365d' }}>
              {translateTitle(metadata.title)}
            </h1>
            <p style={{ fontSize: 13, color: '#666', margin: '0 0 12px' }}>
              {metadata.startDate} to {metadata.endDate}
            </p>

            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <div style={{ flex: '0 0 40%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', padding: 12, background: '#f3f4f6', borderRadius: 8, fontSize: 11, height: 300, alignContent: 'start' }}>
                  <div><span style={{ color: '#999', textTransform: 'uppercase', fontSize: 9 }}>{t('Boat')}</span><br />{metadata.boatName} ({metadata.boatModel}, {metadata.yearOfManufacture})</div>
                  <div><span style={{ color: '#999', textTransform: 'uppercase', fontSize: 9 }}>{t('Home Marina')}</span><br />{metadata.homeMarina}</div>
                  <div><span style={{ color: '#999', textTransform: 'uppercase', fontSize: 9 }}>{t('Captain')}</span><br />{metadata.captain}</div>
                  <div><span style={{ color: '#999', textTransform: 'uppercase', fontSize: 9 }}>{t('Price (EUR)')}</span><br />{metadata.priceEur}</div>
                  <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#999', textTransform: 'uppercase', fontSize: 9 }}>{t('Crew')}</span><br />{metadata.crew?.join(', ')}</div>
                  <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#999', textTransform: 'uppercase', fontSize: 9 }}>{t('Other Captains')}</span><br />{metadata.captains?.join(', ') || t('N/A')}</div>
                </div>
              </div>
              <div style={{ flex: 1, height: 300, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                {locations.length > 0 && (
                  <MapContainer
                    bounds={L.latLngBounds(locations.map(p => [p.lat, p.lng]))}
                    boundsOptions={{ padding: [30, 30] }}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    dragging={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                    preferCanvas={true}
                  >
                    <TileLayer
                      attribution=""
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <TileLoader onReady={() => setMapReady(true)} />
                    {locations.map((p, i) => (
                      <Marker key={i} position={[p.lat, p.lng]} icon={dayIcon(p.day)} />
                    ))}
                    {Object.entries(gpxData).map(([day, coords]) =>
                      coords.length > 0 && (
                        <Polyline key={day} positions={coords} color="#3b82f6" weight={2.5} opacity={0.7} />
                      )
                    )}
                  </MapContainer>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 8, fontSize: 12 }}>
              <div><strong>{t('Total Miles')}:</strong> {totalDist.toFixed(1)} NM</div>
              <div><strong>{t('Total Hours')}:</strong> {(totalMin / 60).toFixed(1)} h</div>
              <div><strong>{t('Sails Miles')}:</strong> {totalDist > 0 ? ((sailsDist / totalDist) * 100).toFixed(1) : 0}%</div>
              <div><strong>{t('Sails Hours')}:</strong> {totalMin > 0 ? ((sailsMin / totalMin) * 100).toFixed(1) : 0}%</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Day')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Date')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Dist')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Time')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Sails Dist')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Sails Time')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Dir')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Stops')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Island')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('City')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Bay')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{t('Mooring')}</th>
                </tr>
              </thead>
              <tbody>
                {dailyLogs.map((log, i) => (
                  <tr key={i} style={{ height: 30, borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '5px 8px' }}>{log.day}</td>
                    <td style={{ padding: '5px 8px' }}>{log.date}</td>
                    <td style={{ padding: '5px 8px' }}>{log.totalDistanceNm}</td>
                    <td style={{ padding: '5px 8px' }}>{log.totalTime}</td>
                    <td style={{ padding: '5px 8px' }}>{log.sailsDistanceNm}</td>
                    <td style={{ padding: '5px 8px' }}>{log.sailsTime}</td>
                    <td style={{ padding: '5px 8px' }}>{log.sailDirection}</td>
                    <td style={{ padding: '5px 8px' }}>{log.interestingStops}</td>
                    <td style={{ padding: '5px 8px' }}>{log.overnightIsland}</td>
                    <td style={{ padding: '5px 8px' }}>{log.overnightCity}</td>
                    <td style={{ padding: '5px 8px' }}>{log.overnightBay}</td>
                    <td style={{ padding: '5px 8px' }}>{log.mooringType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 9999, background: 'rgba(255,255,255,0.9)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            width: 40, height: 40, border: '4px solid #e5e7eb',
            borderTopColor: '#1a365d', borderRadius: '50%',
            animation: 'pdf-spin 1s linear infinite'
          }} />
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a365d', marginTop: 16 }}>
            {t('Generating PDF')}...
          </div>
          <style>{`@keyframes pdf-spin{to{transform:rotate(360deg)}}`}</style>
        </div>
        </>,
        document.body
      )}
    </>
  );
}

export default ExportPdfButton;
