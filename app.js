const locationsUrl = 'data/f1-locations.json';
const geoJsonBase = 'https://raw.githubusercontent.com/bacinger/f1-circuits/master/circuits/';

const listElement = document.getElementById('circuit-list');
const searchElement = document.getElementById('circuit-search');
const countElement = document.getElementById('circuit-count');
const selectedElement = document.getElementById('selected-track');
const mapElement = document.getElementById('map');

let map = null;
let circuits = [];
let markers = new Map();
let activeId = null;
let trackLayer = null;
let requestNumber = 0;

function setupMap() {
  if (!window.L) {
    mapElement.innerHTML = '<div class="track-preview-empty">the map library did not load. circuit layouts can still be opened from the list.</div>';
    return;
  }
  map = L.map(mapElement, { zoomControl: true, scrollWheelZoom: true, worldCopyJump: true }).setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  map.whenReady(() => requestAnimationFrame(() => map.invalidateSize(true)));
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => map.invalidateSize()).observe(mapElement);
  }
}

function markerIcon(selected = false) {
  return L.divIcon({
    className: '',
    html: '<span class="circuit-marker' + (selected ? ' selected' : '') + '"></span>',
    iconSize: selected ? [17, 17] : [13, 13],
    iconAnchor: selected ? [8, 8] : [6, 6]
  });
}

function renderList(query = '') {
  const filtered = circuits.filter(c => (c.name + ' ' + c.location).toLowerCase().includes(query.toLowerCase()));
  listElement.innerHTML = '';
  if (!filtered.length) {
    listElement.innerHTML = '<div class="loading-list">no circuits found — try another search.</div>';
    return;
  }
  filtered.forEach((circuit, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'circuit-item' + (circuit.id === activeId ? ' active' : '');
    button.innerHTML = '<span class="item-number"></span><span class="item-copy"><span class="item-name"></span><span class="item-place"></span></span><span class="item-arrow">↗</span>';
    button.querySelector('.item-number').textContent = String(index + 1).padStart(2, '0');
    button.querySelector('.item-name').textContent = circuit.name;
    button.querySelector('.item-place').textContent = circuit.location;
    button.addEventListener('click', () => selectCircuit(circuit));
    listElement.appendChild(button);
  });
}

function updateMarkers() {
  circuits.forEach(circuit => {
    const marker = markers.get(circuit.id);
    if (marker) marker.setIcon(markerIcon(circuit.id === activeId));
  });
}

const current2026CircuitIds = new Set([
  'au-1953', 'cn-2004', 'jp-1962', 'us-2022', 'ca-1978',
  'mc-1929', 'es-1991', 'at-1969', 'gb-1948', 'be-1925',
  'hu-1986', 'nl-1948', 'it-1922', 'es-2026', 'az-2016',
  'my-1999', 'sg-2008', 'us-2012', 'mx-1962', 'br-1940',
  'us-2023', 'qa-2004', 'ae-2009'
]);

function showTrackStatus(title, message, loading = false, isCurrent2026 = false) {
  selectedElement.replaceChildren();
  const heading = document.createElement('div');
  heading.className = 'track-preview-heading';
  const copy = document.createElement('div');
  const strong = document.createElement('strong');
  strong.textContent = title;
  const subtitle = document.createElement('span');
  subtitle.textContent = message;
  copy.append(strong, subtitle);
  const status = document.createElement('span');
  status.className = 'track-status';
  status.textContent = loading ? 'LOADING' : 'TRACK LAYOUT';
  heading.append(copy);
  if (isCurrent2026) {
    const seasonBadge = document.createElement('span');
    seasonBadge.className = 'current-season-badge';
    seasonBadge.textContent = 'CURRENT 2026 CIRCUIT';
    seasonBadge.setAttribute('aria-label', 'Current 2026 circuit');
    heading.append(seasonBadge);
  }
  heading.append(status);
  selectedElement.append(heading);
  if (loading) {
    const placeholder = document.createElement('div');
    placeholder.className = 'track-preview-empty';
    placeholder.textContent = 'loading circuit layout…';
    selectedElement.append(placeholder);
  }
}

function collectLines(value, lines = []) {
  if (!value) return lines;
  if (value.type === 'FeatureCollection') value.features.forEach(feature => collectLines(feature, lines));
  else if (value.type === 'Feature') collectLines(value.geometry, lines);
  else if (value.type === 'LineString') lines.push(value.coordinates);
  else if (value.type === 'MultiLineString') value.coordinates.forEach(line => lines.push(line));
  else if (value.type === 'GeometryCollection') value.geometries.forEach(geometry => collectLines(geometry, lines));
  return lines;
}

function drawTrackPreview(geojson) {
  const lines = collectLines(geojson).filter(line => Array.isArray(line) && line.length > 1);
  if (!lines.length) throw new Error('No line geometry found in this circuit file');
  const points = lines.flat();
  const xs = points.map(point => Number(point[0]));
  const ys = points.map(point => Number(point[1]));
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const pad = 42, width = 720, height = 420;
  const spanX = Math.max(maxX - minX, 0.00001);
  const spanY = Math.max(maxY - minY, 0.00001);
  const scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY);
  const offsetX = (width - spanX * scale) / 2;
  const offsetY = (height - spanY * scale) / 2;
  const paths = lines.map(line => line.map((point, index) => {
    const x = (Number(point[0]) - minX) * scale + offsetX;
    const y = height - ((Number(point[1]) - minY) * scale + offsetY);
    return (index ? 'L' : 'M') + x.toFixed(2) + ',' + y.toFixed(2);
  }).join(' '));
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'track-preview');
  svg.setAttribute('viewBox', '0 0 720 420');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Circuit track layout');
  paths.forEach(pathData => {
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glow.setAttribute('class', 'track-glow');
    glow.setAttribute('d', pathData);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    svg.append(glow, path);
  });
  selectedElement.append(svg);
}

async function selectCircuit(circuit) {
  activeId = circuit.id;
  updateMarkers();
  renderList(searchElement.value);
  const currentRequest = ++requestNumber;
  showTrackStatus(circuit.name, 'loading the track layout…', true, current2026CircuitIds.has(circuit.id));
  try {
    const response = await fetch(geoJsonBase + encodeURIComponent(circuit.id) + '.geojson');
    if (!response.ok) throw new Error('Track data could not be loaded (' + response.status + ')');
    const geojson = await response.json();
    if (currentRequest !== requestNumber) return;
    if (map) {
      if (trackLayer) map.removeLayer(trackLayer);
      trackLayer = L.geoJSON(geojson, {
        style: { color: '#c92335', weight: 5, opacity: 0.96, lineCap: 'round', lineJoin: 'round' }
      }).addTo(map);
      const bounds = trackLayer.getBounds();
      if (bounds.isValid()) {
        map.invalidateSize();
        map.fitBounds(bounds.pad(0.22), { maxZoom: 16, animate: true });
      }
    }
    showTrackStatus(circuit.name, circuit.location, false, current2026CircuitIds.has(circuit.id));
    drawTrackPreview(geojson);
    selectedElement.querySelector('.track-status').textContent = 'LAYOUT OPEN';
  } catch (error) {
    if (currentRequest !== requestNumber) return;
    showTrackStatus(circuit.name, 'could not load this track — please try again.', false, current2026CircuitIds.has(circuit.id));
    selectedElement.querySelector('.track-status').textContent = 'ERROR';
    console.error(error);
  }
}

async function initialise() {
  setupMap();
  try {
    const response = await fetch(locationsUrl);
    if (!response.ok) throw new Error('Circuit list could not be loaded');
    circuits = await response.json();
    circuits.sort((a, b) => a.name.localeCompare(b.name));
    countElement.textContent = circuits.length + ' TRACKS';
    circuits.forEach(circuit => {
      if (!map) return;
      const marker = L.marker([circuit.lat, circuit.lon], {
        icon: markerIcon(),
        title: circuit.name,
        keyboard: true
      }).addTo(map);
      marker.bindTooltip(circuit.name + ' · ' + circuit.location, { direction: 'top', offset: [0, -7] });
      marker.on('click', () => selectCircuit(circuit));
      markers.set(circuit.id, marker);
    });
    renderList();
    if (map) {
      map.setView([20, 0], 2);
      requestAnimationFrame(() => map.invalidateSize(true));
    }
  } catch (error) {
    listElement.innerHTML = '<div class="loading-list">could not load the circuit list. refresh to try again.</div>';
    console.error(error);
  }
}

searchElement.addEventListener('input', () => renderList(searchElement.value));
document.addEventListener('keydown', event => {
  if (event.key === '/' && document.activeElement !== searchElement && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchElement.focus();
  }
  if (event.key === 'Escape') searchElement.blur();
});
initialise();
