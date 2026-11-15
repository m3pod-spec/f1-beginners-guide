const locationsUrl = 'data/f1-locations.json';
const geoJsonBase = 'https://raw.githubusercontent.com/bacinger/f1-circuits/master/circuits/';
const map = L.map('map', { zoomControl: true, scrollWheelZoom: true, worldCopyJump: true }).setView([22, 8], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const listElement = document.getElementById('circuit-list');
const searchElement = document.getElementById('circuit-search');
const countElement = document.getElementById('circuit-count');
const selectedElement = document.getElementById('selected-track');
let circuits = [];
let markers = new Map();
let activeId = null;
let trackLayer = null;
let requestNumber = 0;

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
    button.innerHTML = '<span class="item-number">' + String(index + 1).padStart(2, '0') + '</span>' +
      '<span class="item-copy"><span class="item-name"></span><span class="item-place"></span></span><span class="item-arrow">↗</span>';
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

function showTrackStatus(title, message, loading = false) {
  selectedElement.innerHTML = '<div class="empty-track-icon">' + (loading ? '<span class="loader"></span>' : '◎') + '</div>' +
    '<div class="empty-track-text"><strong></strong><span></span></div><span class="track-status"></span>';
  selectedElement.querySelector('strong').textContent = title;
  selectedElement.querySelector('.empty-track-text span').textContent = message;
  selectedElement.querySelector('.track-status').textContent = loading ? 'LOADING' : 'TRACK LAYOUT';
}

async function selectCircuit(circuit) {
  activeId = circuit.id;
  updateMarkers();
  renderList(searchElement.value);
  const currentRequest = ++requestNumber;
  showTrackStatus(circuit.name, 'loading the track layout...', true);
  try {
    const response = await fetch(geoJsonBase + encodeURIComponent(circuit.id) + '.geojson');
    if (!response.ok) throw new Error('Track data could not be loaded');
    const geojson = await response.json();
    if (currentRequest !== requestNumber) return;
    if (trackLayer) map.removeLayer(trackLayer);
    trackLayer = L.geoJSON(geojson, {
      style: { color: '#c92335', weight: 5, opacity: 0.96, lineCap: 'round', lineJoin: 'round' }
    }).addTo(map);
    const bounds = trackLayer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.22), { maxZoom: 16, animate: true });
    showTrackStatus(circuit.name, circuit.location, false);
    selectedElement.querySelector('.track-status').textContent = 'LAYOUT OPEN';
  } catch (error) {
    if (currentRequest !== requestNumber) return;
    showTrackStatus(circuit.name, 'could not load this track — please try again.', false);
    selectedElement.querySelector('.track-status').textContent = 'ERROR';
    console.error(error);
  }
}

async function initialise() {
  try {
    const response = await fetch(locationsUrl);
    if (!response.ok) throw new Error('Circuit list could not be loaded');
    circuits = await response.json();
    circuits.sort((a, b) => a.name.localeCompare(b.name));
    countElement.textContent = circuits.length + ' TRACKS';
    circuits.forEach(circuit => {
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
    const singapore = circuits.find(c => c.id === 'sg-2008');
    if (singapore) {
      map.setView([singapore.lat, singapore.lon], 3);
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
