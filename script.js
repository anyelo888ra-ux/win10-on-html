// ==========================================
// CAPTURA DE ELEMENTOS DEL SISTEMA
// ==========================================
const desktop = document.getElementById('desktop');
const customMenu = document.getElementById('custom-menu');
const refreshBtn = document.getElementById('refresh-btn');
const startWinBtn = document.getElementById('start-win-btn');
const startMenu = document.getElementById('start-menu');
const powerBtn = document.getElementById('power-btn');
const shortcuts = document.querySelectorAll('.shortcut');

// Elementos de Ventana: Este Equipo
const pcIcon = document.getElementById('pc-icon');
const winWindow = document.getElementById('win-window');
const closeWinBtn = document.getElementById('close-win-btn');

// Elementos de Ventana: Bloc de Notas
const notepadWindow = document.getElementById('notepad-window');
const closeNotepadBtn = document.getElementById('close-notepad-btn');
// Capturamos el botón físico dentro del menú de inicio
const notepadAppBtn = Array.from(document.querySelectorAll('.app-item')).find(el => el.textContent.includes('Bloc de notas'));

// ==========================================
// INTERACCIONES DEL ESCRITORIO Y MENÚS
// ==========================================

desktop.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  customMenu.style.top = `${e.clientY}px`;
  customMenu.style.left = `${e.clientX}px`;
  customMenu.style.display = 'block';
  startMenu.style.display = 'none';
});

refreshBtn.addEventListener('click', function() {
  desktop.style.opacity = '0.5';
  setTimeout(() => { desktop.style.opacity = '1'; }, 100);
  customMenu.style.display = 'none';
});

startWinBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  customMenu.style.display = 'none';
  startMenu.style.display = startMenu.style.display === 'flex' ? 'none' : 'flex';
});

shortcuts.forEach(shortcut => {
  shortcut.addEventListener('click', function(e) {
    e.stopPropagation();
    shortcuts.forEach(s => s.classList.remove('selected'));
    this.classList.add('selected');
  });
});

document.addEventListener('click', function(e) {
  if (!customMenu.contains(e.target)) customMenu.style.display = 'none';
  if (!startMenu.contains(e.target) && e.target !== startWinBtn) startMenu.style.display = 'none';
  if (!e.target.closest('.shortcut')) shortcuts.forEach(s => s.classList.remove('selected'));
});

// ==========================================
// ACCIONES PARA ABRIR Y CERRAR APLICACIONES
// ==========================================

// Control de "Este equipo"
pcIcon.addEventListener('dblclick', function(e) {
  e.stopPropagation();
  winWindow.style.display = 'flex';
  llevarAlFrente(winWindow);
});
closeWinBtn.addEventListener('click', function() {
  winWindow.style.display = 'none';
});

// Control de "Bloc de notas"
if(notepadAppBtn) {
  notepadAppBtn.style.cursor = 'default';
  notepadAppBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    notepadWindow.style.display = 'flex';
    startMenu.style.display = 'none'; // Cierra el menú al abrir la app
    llevarAlFrente(notepadWindow);
  });
}
closeNotepadBtn.addEventListener('click', function() {
  notepadWindow.style.display = 'none';
});

// Función auxiliar para que la ventana en la que haces clic se ponga arriba de las demás
let zIndexActual = 9990;
function llevarAlFrente(ventana) {
  zIndexActual++;
  ventana.style.zIndex = zIndexActual;
}

document.querySelectorAll('.window').forEach(win => {
  win.addEventListener('mousedown', function() {
    llevarAlFrente(this);
  });
});

// ==========================================
// FUNCIÓN UNIVERSAL PARA ARRASTRAR VENTANAS
// ==========================================
let isDragging = false;
let startX, startY, initialLeft, initialTop, ventanaActiva;

document.querySelectorAll('.window-header').forEach(header => {
  header.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('control-btn')) return;
    
    isDragging = true;
    ventanaActiva = this.closest('.window');
    llevarAlFrente(ventanaActiva);
    
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = ventanaActiva.offsetLeft;
    initialTop = ventanaActiva.offsetTop;
  });
});

document.addEventListener('mousemove', function(e) {
  if (!isDragging || !ventanaActiva) return;
  
  let newX = initialLeft + (e.clientX - startX);
  let newY = initialTop + (e.clientY - startY);
  
  if (newY < 0) newY = 0;
  
  ventanaActiva.style.left = `${newX}px`;
  ventanaActiva.style.top = `${newY}px`;
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  ventanaActiva = null;
});

// ==========================================
// APAGADO SIMULADO
// ==========================================
powerBtn.addEventListener('click', function() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0'; overlay.style.left = '0';
  overlay.style.width = '100vw'; overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'black'; overlay.style.color = 'white';
  overlay.style.display = 'flex'; overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center'; overlay.style.alignItems = 'center';
  overlay.style.zIndex = '999999';
  overlay.style.fontSize = '24px';
  overlay.innerHTML = '<p>Apagando el equipo...</p>';
  document.body.appendChild(overlay);
  setTimeout(() => { location.reload(); }, 3000);
});
// ==========================================
// RELOJ DIGITAL EN TIEMPO REAL
// ==========================================
function actualizarReloj() {
  const elementoTiempo = document.getElementById('clock-time');
  const elementoFecha = document.getElementById('clock-date');
  if (!elementoTiempo || !elementoFecha) return;

  const ahora = new Date();

  // Obtener y formatear la hora (HH:MM)
  let horas = ahora.getHours();
  let minutos = ahora.getMinutes();
  let ampm = horas >= 12 ? ' PM' : ' AM';
  
  // Convertir a formato de 12 horas si prefieres, o dejarlo en 24:
  horas = horas % 12;
  horas = horas ? horas : 12; // el número '0' debería ser '12'
  minutos = minutos < 10 ? '0' + minutos : minutos;
  
  elementoTiempo.textContent = horas + ':' + minutos + ampm;

  // Obtener y formatear la fecha (DD/MM/AAAA)
  const dia = ahora.getDate();
  const mes = ahora.getMonth() + 1; // Los meses van de 0 a 11
  const anio = ahora.getFullYear();
  
  const diaFormateado = dia < 10 ? '0' + dia : dia;
  const mesFormateado = mes < 10 ? '0' + mes : mes;

  elementoFecha.textContent = `${diaFormateado}/${mesFormateado}/${anio}`;
}

// Ejecutar la función inmediatamente al cargar y luego cada 1 segundo
actualizarReloj();
setInterval(actualizarReloj, 1000);