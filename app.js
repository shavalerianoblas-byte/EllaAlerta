/* EllaAlerta — NÚCLEO compartido por todas las páginas (index y paginas/*.html) */
const BASE = location.pathname.includes('/paginas/') ? '../' : '';
/* Cada rol tiene su página: paginas/estudiante.html, apoyo.html, seguridad.html y admin.html */
const paginaDeRol = (rol) => (BASE ? '' : 'paginas/') + rol + '.html';
function entrarAlPanel(u, mensaje) {
  try { sessionStorage.setItem('ea_uid', u.id); if (mensaje) sessionStorage.setItem('ea_toast', mensaje); } catch {}
  location.href = paginaDeRol(u.rol);
}

const LOGO_IMG = `
  <img src="${BASE}imagen/logo.png" width="36" height="36" alt="" aria-hidden="true">
`;

const ROLES = {
  estudiante: 'Estudiante UPC',
  apoyo: 'Red de apoyo',
  seguridad: 'Seguridad Patrimonial',
  admin: 'Administración (Intranet)'
};

const $ = (sel, root = document) => root.querySelector(sel);

const esc = (str) => String(str ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const nowISO = () => new Date().toISOString();

const formatFecha = (iso) => new Date(iso).toLocaleString('es-PE', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
});

const icon = (name, extraClass = '') =>
  `<span class="material-symbols-outlined ${extraClass}" aria-hidden="true">${name}</span>`;

const DB = {
  get: (table) => {
    try { return JSON.parse(localStorage.getItem('ea_' + table) || '[]'); }
    catch { return []; }
  },
  set: (table, data) => {
    try { localStorage.setItem('ea_' + table, JSON.stringify(data)); }
    catch {}
  },
  add: (table, record) => {
    const list = DB.get(table);
    const item = { id: uid(), ...record };
    DB.set(table, [...list, item]);
    return item;
  },
  upd: (table, id, patch) => {
    DB.set(table, DB.get(table).map(row => row.id === id ? { ...row, ...patch } : row));
  },
  del: (table, id) => {
    DB.set(table, DB.get(table).filter(row => row.id !== id));
  }
};

async function hashClave(texto) {
  try {
    if (window.crypto && window.crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {}
  return btoa(unescape(encodeURIComponent(texto)));
}

function toast(mensaje, tipo = 'info') {
  const container = $('#toast-container');
  if (!container) return;
  const el = document.createElement('div');
  const colores = tipo === 'error'
    ? 'bg-alertaRojo text-white border-red-300'
    : tipo === 'ok'
    ? 'bg-seguroVerde text-white border-emerald-200'
    : 'bg-white text-cobalto border-acento1';
  el.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium transition-all duration-300 ${colores}`;
  el.innerHTML = `${icon(tipo === 'error' ? 'error' : 'check_circle')}<span>${esc(mensaje)}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => el.remove(), 300);
  }, 3600);
}

let state = {
  user: null,
  screen: 'landing',
  authMode: 'login',
  regStep: 1,
  regPerfil: 'estudiante',
  activeTab: null,
  mobileMenuOpen: false,
  rutaTipo: 'iluminada',
  destino: 'Paradero Av. La Marina',
  emergenciaTipo: 'Acoso',
  patronActivo: 'Patrón 2 (Vol- Vol+ Vol-)',
  entrenamientoHits: 0,
  ubicacionCompartida: true,
  historialFiltro: 'Todos',
  segFiltroFranja: 'Noche',
  segFiltroTipo: 'Todos',
  adminSearch: '',
  adminRoleFilter: 'todos',
  confirmDeleteUserId: null
};

async function seedDatabase() {
  if (DB.get('usuarios').length > 0) return;

  const passAdmin = await hashClave('Admin123');
  const passDemo = await hashClave('12345678');

  DB.set('usuarios', [
    { id: 'usr_admin', nombre: 'Grupo Principal EllaAlerta', correo: 'admin@ellaalerta.pe', clave: passAdmin, rol: 'admin', activo: true, creado: nowISO() },
    { id: 'usr_daniela', nombre: 'Daniela Mendoza', correo: 'u202512345@upc.edu.pe', clave: passDemo, rol: 'estudiante', activo: true, creado: nowISO() },
    { id: 'usr_yeison', nombre: 'Yeison León (Hermano)', correo: 'yeison.apoyo@gmail.com', clave: passDemo, rol: 'apoyo', activo: true, creado: nowISO() },
    { id: 'usr_carlos', nombre: 'Agente Carlos Mendoza', correo: 'seguridad.sanmiguel@upc.edu.pe', clave: passDemo, rol: 'seguridad', activo: true, creado: nowISO() }
  ]);

  DB.set('red', [
    { id: 'red_1', uid: 'usr_daniela', nombre: 'Mariana (Mamá)', rel: 'Familiar', contacto: 'mariana.mama@gmail.com', celular: '976 543 129', estado: 'Activo', primeraResp: true },
    { id: 'red_2', uid: 'usr_daniela', nombre: 'Yeison León', rel: 'Familiar', contacto: 'yeison.apoyo@gmail.com', celular: '988 112 334', estado: 'Activo', primeraResp: false },
    { id: 'red_3', uid: 'usr_daniela', nombre: 'Araceli Torres', rel: 'Compañera', contacto: 'u202598765@upc.edu.pe', celular: '944 221 009', estado: 'Pendiente', primeraResp: false }
  ]);

  DB.set('trayectos', [
    { id: 'tr_1', uid: 'usr_daniela', destino: 'Paradero Av. La Marina', ruta: 'iluminada', estado: 'en trayecto', inicio: nowISO(), bateria: 82, eta: '14 min' }
  ]);

  DB.set('alertas', [
    {
      id: 'al_104',
      uid: 'usr_daniela',
      nombre: 'Daniela Mendoza',
      tipo: 'Acoso',
      ubicacion: 'Av. La Marina cdra. 28 · Puerta 2 UPC San Miguel',
      estado: 'activa',
      fecha: nowISO(),
      resp: [{ nombre: 'Mariana (Mamá)', r: 'Voy en camino · 21:55' }]
    }
  ]);

  DB.set('reportes', [
    { id: 'rep_103', uid: 'usr_daniela', anon: true, tipo: 'Poca iluminación', ubic: 'Ca. Escardó cdra. 4', det: 'Poste de alumbrado público apagado frente al paradero.', fecha: nowISO(), estado: 'nuevo' },
    { id: 'rep_102', uid: 'usr_daniela', anon: true, tipo: 'Seguimiento sospechoso', ubic: 'Av. Universitaria cruce La Marina', det: 'Sujeto merodeando salida de estudiantes a las 21:40.', fecha: nowISO(), estado: 'leído' }
  ]);

  DB.set('comentarios', [
    { id: 'com_1', uid: 'usr_daniela', nombre: 'Daniela Mendoza', rol: 'estudiante', msg: 'Sería genial añadir más puntos seguros en Av. Universitaria.', fecha: nowISO(), estado: 'nuevo' }
  ]);
}

function renderMapaSVG(tipoRuta = 'iluminada', mostrarCalor = false) {
  return `
    <div class="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#dfe6ee] border-2 border-white shadow-inner">
      <svg viewBox="0 0 420 300" class="w-full h-full object-cover" role="img" aria-label="Mapa interactivo Campus UPC San Miguel">
        <rect width="420" height="300" fill="#dfe6ee"/>
        <rect x="20" y="20" width="95" height="65" rx="8" fill="#cfd8e3"/>
        <rect x="145" y="15" width="130" height="70" rx="8" fill="#cfd8e3"/>
        <rect x="305" y="20" width="95" height="65" rx="8" fill="#c7d5e8"/>
        <rect x="20" y="115" width="95" height="90" rx="8" fill="#cfd8e3"/>
        <rect x="145" y="115" width="130" height="90" rx="8" fill="#cfd8e3"/>
        <rect x="305" y="115" width="95" height="90" rx="8" fill="#cfd8e3"/>
        <rect x="20" y="230" width="95" height="55" rx="8" fill="#cfd8e3"/>
        <rect x="145" y="230" width="130" height="55" rx="8" fill="#cfd8e3"/>
        <rect x="305" y="230" width="95" height="55" rx="8" fill="#cfd8e3"/>

        <path d="M0 100H420M0 218H420M130 0V300M290 0V300" stroke="#FFFFFF" stroke-width="16" fill="none"/>
        <path d="M0 100H420M0 218H420M130 0V300M290 0V300" stroke="#eef3fa" stroke-width="2" stroke-dasharray="6 6" fill="none"/>

        ${mostrarCalor ? `
          <circle cx="290" cy="100" r="46" fill="#D93A3A" fill-opacity="0.35"/>
          <circle cx="290" cy="100" r="22" fill="#D93A3A" fill-opacity="0.55"/>
          <circle cx="130" cy="218" r="40" fill="#D9822B" fill-opacity="0.35"/>
          <circle cx="130" cy="100" r="38" fill="#1E8E5A" fill-opacity="0.30"/>
        ` : `
          ${tipoRuta === 'iluminada'
            ? `<path d="M330 55 L290 100 L130 100 L130 218 L195 265" stroke="#2E3F6D" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
               <path d="M330 55 L290 100 L130 100 L130 218 L195 265" stroke="#BBD0ED" stroke-width="2.5" stroke-dasharray="6 6" fill="none"/>`
            : `<path d="M330 55 L290 100 L290 265" stroke="#7187B9" stroke-width="7" stroke-linecap="round" stroke-dasharray="10 8" fill="none"/>`
          }
          <circle cx="130" cy="145" r="13" fill="#1E8E5A" stroke="#FFFFFF" stroke-width="3"/>
          <text x="130" y="149" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="bold">P</text>
        `}

        <circle cx="330" cy="55" r="16" fill="#2E3F6D" stroke="#FFFFFF" stroke-width="3"/>
        <text x="330" y="59" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="bold">UPC</text>

        <circle cx="${mostrarCalor ? 290 : (tipoRuta === 'iluminada' ? 195 : 290)}" cy="${mostrarCalor ? 100 : 265}" r="11" fill="#D93A3A" stroke="#FFFFFF" stroke-width="3"/>

        <text x="18" y="94" font-size="11" font-weight="bold" fill="#4A578B">AV. LA MARINA</text>
        <text x="18" y="212" font-size="11" font-weight="bold" fill="#4A578B">AV. UNIVERSITARIA</text>
        <text x="310" y="34" font-size="11" font-weight="bold" fill="#2E3F6D">UPC SAN MIGUEL</text>
      </svg>
      <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/95 backdrop-blur px-3 py-2 rounded-xl text-cobalto text-xs shadow">
        <span class="font-semibold flex items-center gap-1.5">
          ${icon(mostrarCalor ? 'local_fire_department' : 'verified_user', 'text-base text-cobalto')}
          ${mostrarCalor ? 'Mapa de calor perimetral en vivo' : (tipoRuta === 'iluminada' ? 'Ruta Iluminada · 98% cobertura LED' : 'Ruta Corta · 6 min estimados')}
        </span>
        <span class="px-2 py-0.5 rounded-full bg-lavanda text-cobalto font-bold">GPS Activo</span>
      </div>
    </div>
  `;
}

function getNavItemsForRole(rol) {
  if (rol === 'estudiante') {
    return [
      { id: 'rutas', label: 'Rutas', iconName: 'map', primary: true },
      { id: 'sos', label: 'ALERTA', iconName: 'emergency', primary: true, isSos: true },
      { id: 'reportar', label: 'Reportar', iconName: 'flag', primary: true },
      { id: 'red', label: 'Mi Red', iconName: 'groups', primary: false },
      { id: 'historial', label: 'Historial', iconName: 'history', primary: false },
      { id: 'config', label: 'Discreción', iconName: 'tune', primary: false },
      { id: 'ayuda', label: 'Canales', iconName: 'support_agent', primary: false }
    ];
  }
  if (rol === 'apoyo') {
    return [
      { id: 'monitoreo', label: 'Monitoreo', iconName: 'visibility', primary: true },
      { id: 'crisis', label: 'Sala Crisis', iconName: 'crisis_alert', primary: true },
      { id: 'ayuda', label: 'Canales', iconName: 'support_agent', primary: true }
    ];
  }
  if (rol === 'seguridad') {
    return [
      { id: 'bandeja', label: 'Alertas', iconName: 'notifications_active', primary: true },
      { id: 'mapa_seg', label: 'Mapa Perimetral', iconName: 'local_fire_department', primary: true },
      { id: 'analitica', label: 'Reportes PDF', iconName: 'table_chart', primary: true },
      { id: 'ayuda', label: 'Canales', iconName: 'support_agent', primary: false }
    ];
  }
  return [
    { id: 'intranet_usuarios', label: 'Base de Datos Usuarios', iconName: 'manage_accounts', primary: true },
    { id: 'intranet_buzon', label: 'Reportes y Comentarios', iconName: 'inbox', primary: true },
    { id: 'bandeja', label: 'Monitor Alertas', iconName: 'notifications_active', primary: true }
  ];
}

function renderAppShell() {
  const u = state.user;
  const navItems = getNavItemsForRole(u.rol);
  if (!navItems.some(i => i.id === state.activeTab)) {
    state.activeTab = navItems[0].id;
  }

  const activeAlertsCount = DB.get('alertas').filter(a => a.estado === 'activa').length;

  return `
    <div class="min-h-screen flex flex-col pb-24 md:pb-8">
      <header class="sticky top-0 z-30 bg-cobalto/95 backdrop-blur border-b border-acento2/20 px-4 sm:px-8 py-3.5 no-print">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <button onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-xl bg-acento4/70 text-white" aria-label="Abrir menú">
              ${icon('menu')}
            </button>
            <div class="flex items-center gap-2.5">
              ${LOGO_IMG}
              <div>
                <span class="font-bold text-lg tracking-tight block leading-none">EllaAlerta</span>
                <span class="text-[11px] text-acento1">${ROLES[u.rol]}</span>
              </div>
            </div>
          </div>

          <nav class="hidden md:flex items-center gap-1.5 bg-acento4/40 p-1.5 rounded-2xl border border-acento2/20">
            ${navItems.map(item => {
              const active = state.activeTab === item.id;
              return `
                <button onclick="setTab('${item.id}')"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                          active
                            ? 'bg-white text-cobalto shadow'
                            : item.isSos
                            ? 'bg-alertaRojo/90 text-white hover:bg-alertaRojo'
                            : 'text-lavanda hover:bg-acento4/70 hover:text-white'
                        }">
                  ${icon(item.iconName, 'text-lg')}
                  <span>${item.label}</span>
                  ${(item.id === 'crisis' || item.id === 'bandeja') && activeAlertsCount > 0
                    ? `<span class="px-1.5 py-0.5 text-[10px] rounded-full bg-alertaRojo text-white font-bold">${activeAlertsCount}</span>`
                    : ''}
                </button>
              `;
            }).join('')}
          </nav>

          <div class="flex items-center gap-2 sm:gap-3">
            
            <div class="hidden sm:block text-right">
              <p class="text-sm font-bold leading-tight">${esc(u.nombre)}</p>
              <p class="text-[11px] text-acento1">${esc(u.correo)}</p>
            </div>
            <button onclick="logout()" title="Cerrar sesión"
                    class="p-2.5 rounded-xl bg-acento4/70 hover:bg-alertaRojo text-white transition" aria-label="Cerrar sesión">
              ${icon('logout', 'text-xl')}
            </button>
          </div>
        </div>
      </header>

      ${state.mobileMenuOpen ? `
        <div class="fixed inset-0 z-40 md:hidden flex">
          <div onclick="toggleMobileMenu()" class="fixed inset-0 bg-black/60 backdrop-blur-xs"></div>
          <aside class="relative w-80 max-w-[85vw] bg-cobalto border-r border-acento2/30 p-5 flex flex-col justify-between z-10 overflow-y-auto">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="font-bold text-lg">Menú</span>
                <button onclick="toggleMobileMenu()" class="p-2 rounded-xl bg-acento4 text-white">${icon('close')}</button>
              </div>

              <div class="bg-white text-cobalto p-4 rounded-2xl flex items-center gap-3 shadow">
                <div class="w-11 h-11 rounded-full bg-lavanda flex items-center justify-center font-bold text-cobalto text-lg">
                  ${esc(u.nombre.charAt(0).toUpperCase())}
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-sm truncate">${esc(u.nombre)}</p>
                  <p class="text-xs text-acento4 truncate">${esc(u.correo)}</p>
                  <span class="inline-block mt-1 px-2 py-0.5 rounded-full bg-lavanda text-[10px] font-bold">${ROLES[u.rol]}</span>
                </div>
              </div>

              <div class="space-y-2">
                ${navItems.map(item => `
                  <button onclick="setTab('${item.id}'); toggleMobileMenu();"
                          class="w-full flex items-center justify-between p-3.5 rounded-2xl text-left font-semibold text-sm transition ${
                            state.activeTab === item.id ? 'bg-white text-cobalto shadow' : 'bg-lavanda/95 text-cobalto hover:bg-white'
                          }">
                    <span class="flex items-center gap-3">${icon(item.iconName)} ${item.label}</span>
                    ${icon('chevron_right', 'text-acento3')}
                  </button>
                `).join('')}
                
              </div>
            </div>

            <button onclick="logout()" class="mt-6 w-full py-3 rounded-2xl border border-acento2/40 text-white font-bold text-sm hover:bg-alertaRojo transition">
              Cerrar sesión
            </button>
          </aside>
        </div>
      ` : ''}

      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        ${renderActiveTabContent()}
      </main>

      <nav class="md:hidden fixed bottom-0 inset-x-0 z-30 bg-cobalto/95 backdrop-blur border-t border-acento2/25 px-3 py-2 flex items-center justify-around no-print">
        ${navItems.filter(i => i.primary).map(item => {
          const active = state.activeTab === item.id;
          if (item.isSos) {
            return `
              <button onclick="setTab('${item.id}')"
                      class="-mt-7 w-16 h-16 rounded-full bg-alertaRojo text-white shadow-xl border-4 border-cobalto flex flex-col items-center justify-center">
                ${icon('emergency', 'text-2xl')}
                <span class="text-[10px] font-bold">ALERTA</span>
              </button>
            `;
          }
          return `
            <button onclick="setTab('${item.id}')"
                    class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${active ? 'text-white bg-acento4/70' : 'text-acento1'}">
              ${icon(item.iconName, 'text-xl')}
              <span class="text-[11px] font-semibold">${item.label}</span>
            </button>
          `;
        }).join('')}
      </nav>
    </div>
  `;
}

function toggleMobileMenu() { state.mobileMenuOpen = !state.mobileMenuOpen; render(); }

function viewSeguridadBandeja() {
  const alertas = DB.get('alertas').slice().reverse();

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="t-titulo">Centro de Mando Institucional</h1>
          <p class="t-pequeno text-acento1">Campus UPC San Miguel · Bandeja de alertas críticas en tiempo real.</p>
        </div>
        <button onclick="setTab('mapa_seg')" class="px-5 py-3 rounded-2xl bg-acento1 text-cobalto font-bold text-sm flex items-center gap-2 self-start">
          ${icon('local_fire_department')} Ver Mapa Perimetral
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 space-y-3">
          ${alertas.map(a => `
            <div class="bg-white text-cobalto p-5 rounded-3xl shadow-xl border-l-8 ${a.estado === 'activa' ? 'border-alertaRojo' : 'border-seguroVerde'} flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${a.estado === 'activa' ? 'bg-red-100 text-alertaRojo' : 'bg-emerald-100 text-seguroVerde'}">
                  ${a.estado === 'activa' ? 'Peligro Inminente · Activa' : 'Atendida'}
                </span>
                <h3 class="font-bold text-lg">${esc(a.tipo)} — ${esc(a.ubicacion || 'Av. La Marina cdra. 28')}</h3>
                <p class="text-xs text-acento4">Estudiante: <b>${esc(a.nombre)}</b> · ${formatFecha(a.fecha)}</p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                ${a.estado === 'activa' ? `
                  <button onclick="atenderAlertaSeguridad('${a.id}')" class="px-4 py-2.5 rounded-xl bg-cobalto text-white font-bold text-xs hover:bg-acento4">
                    Marcar como Atendida
                  </button>
                ` : `
                  <span class="text-xs font-bold text-seguroVerde flex items-center gap-1">${icon('check_circle', 'text-base')} Resuelta</span>
                `}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="lg:col-span-5 space-y-3">
          ${renderMapaSVG('iluminada', true)}
          <div class="bg-white text-cobalto p-4 rounded-2xl flex items-center justify-around text-xs font-bold">
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-alertaRojo"></span> Alta incidencia</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-alertaAmbar"></span> Precaución</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-seguroVerde"></span> Zona segura</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function atenderAlertaSeguridad(alertaId) {
  DB.upd('alertas', alertaId, { estado: 'atendida' });
  toast('Alerta marcada como atendida por Seguridad Patrimonial.', 'ok');
  render();
}

function viewCanalesAyuda() {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-6 space-y-4">
        <h1 class="t-titulo">Canales de Ayuda</h1>
        <p class="t-pequeno text-acento1">Líneas directas de emergencia e instituciones de apoyo en Perú.</p>

        <div class="space-y-3">
          ${[
            { title: 'Seguridad UPC', sub: 'Central de campus San Miguel', tel: '013133333', label: '01 313-3333', iconName: 'school' },
            { title: 'Policía Nacional del Perú', sub: 'Central de emergencias 24/7', tel: '105', label: '105', iconName: 'local_police' },
            { title: 'Línea 100 (MIMP)', sub: 'Orientación y apoyo contra la violencia', tel: '100', label: '100', iconName: 'support_agent' },
            { title: 'Serenazgo San Miguel', sub: 'Patrullaje municipal integrado', tel: '017159700', label: '01 715-9700', iconName: 'shield' }
          ].map(c => `
            <a href="tel:${c.tel}" class="bg-white text-cobalto p-4 rounded-2xl shadow flex items-center justify-between hover:bg-lavanda transition">
              <div class="flex items-center gap-3.5">
                <div class="p-3 rounded-xl bg-lavanda text-cobalto">${icon(c.iconName)}</div>
                <div>
                  <p class="font-bold text-base">${c.title}</p>
                  <p class="text-xs text-acento4">${c.sub}</p>
                </div>
              </div>
              <span class="px-3.5 py-2 rounded-xl bg-cobalto text-white text-xs font-bold flex items-center gap-1">
                ${icon('call', 'text-sm')} ${c.label}
              </span>
            </a>
          `).join('')}
        </div>
      </div>

      <form onsubmit="handleEnviarComentario(event)" class="lg:col-span-6 bg-lavanda text-cobalto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h2 class="t-subtitulo">Contáctanos</h2>
        <p class="t-pequeno text-acento4">Envía tus comentarios o sugerencias directamente al equipo administrador de EllaAlerta.</p>
        <div>
          <label class="block text-sm font-bold mb-1.5">Tu mensaje</label>
          <textarea name="msg" rows="5" required placeholder="Escribe aquí tu consulta o sugerencia de mejora..."
                    class="w-full p-4 rounded-2xl bg-white border border-acento1 text-sm focus:outline-none"></textarea>
        </div>
        <button type="submit" class="w-full py-3.5 rounded-2xl bg-cobalto hover:bg-acento4 text-white font-bold text-sm shadow-lg">
          Enviar comentario al equipo
        </button>
      </form>
    </div>
  `;
}

function handleEnviarComentario(e) {
  e.preventDefault();
  const f = e.target;
  DB.add('comentarios', {
    uid: state.user.id,
    nombre: state.user.nombre,
    rol: state.user.rol,
    msg: f.msg.value.trim(),
    fecha: nowISO(),
    estado: 'nuevo'
  });
  f.reset();
  toast('Comentario enviado al buzón de administración.', 'ok');
}


const VISTAS_COMUNES = { ayuda: viewCanalesAyuda, bandeja: viewSeguridadBandeja };
function renderActiveTabContent() {
  const propias = window.VISTAS || {};
  const vista = propias[state.activeTab] || VISTAS_COMUNES[state.activeTab] || Object.values(propias)[0];
  return vista ? vista() : '';
}
function setTab(t) { state.activeTab = t; state.mobileMenuOpen = false; history.replaceState(null, '', '#' + t); render(); }
function logout() {
  try { sessionStorage.removeItem('ea_uid'); } catch {}
  document.body.classList.remove('modo-sigilo');
  location.href = BASE + 'index.html';
}
function render() {
  const root = $('#app');
  if (root && state.user) root.innerHTML = renderAppShell();
}
/* Guardia de sesión: cada página solo la ve su rol */
async function iniciarPanel(rolPagina) {
  await seedDatabase();
  let u = null;
  try { u = DB.get('usuarios').find(x => x.id === sessionStorage.getItem('ea_uid')); } catch {}
  if (!u || !u.activo) { location.replace(BASE + 'index.html'); return; }
  if (u.rol !== rolPagina) { location.replace(paginaDeRol(u.rol)); return; }
  state.user = u; state.screen = 'app';
  const ids = getNavItemsForRole(u.rol).map(i => i.id), h = location.hash.slice(1);
  state.activeTab = ids.includes(h) ? h : ids[0];
  render();
  try { const m = sessionStorage.getItem('ea_toast'); sessionStorage.removeItem('ea_toast'); if (m) toast(m, 'ok'); } catch {}
}
/* Si administración cambia tu rol o te suspende, esta pestaña se redirige sola */
window.addEventListener('storage', () => {
  if (!state.user) return;
  const u = DB.get('usuarios').find(x => x.id === state.user.id);
  if (!u || !u.activo) { logout(); return; }
  if (u.rol !== state.user.rol) { location.replace(paginaDeRol(u.rol)); return; }
  state.user = u; render();
});
function navegarA(idDestino) {
    let pantallas = document.querySelectorAll('main > section');
    
    for (let i = 0; i < pantallas.length; i++) {
        pantallas[i].classList.add('pantalla-oculta');
    }
    
    document.getElementById(idDestino).classList.remove('pantalla-oculta');
    
    window.scrollTo(0, 0);
}
