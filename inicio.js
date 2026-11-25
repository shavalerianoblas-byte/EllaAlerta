/* EllaAlerta — INICIO: landing, inicio de sesión y registro. Redirige a paginas/<rol>.html */
let landingCarouselTimers = [];

function renderLanding() {
  return `
    <div class="min-h-screen flex flex-col justify-between max-w-6xl mx-auto w-full px-5 py-6 sm:px-8 sm:py-8">
      <header class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          ${LOGO_IMG}
          <span class="text-xl sm:text-2xl font-bold tracking-tight">EllaAlerta</span>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          
          <button onclick="goAuth('login')"
                  class="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-acento1 hover:bg-white text-cobalto font-bold text-sm sm:text-base shadow-lg transition">
            Ingresar a la plataforma
          </button>
        </div>
      </header>

      <main class="my-8 sm:my-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-7 space-y-5">
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-acento4/60 border border-acento1/30 text-acento1 text-xs sm:text-sm">
            ${icon('shield_lock', 'text-base')} Ecosistema de Seguridad Universitaria UPC
          </span>
          <h1 class="t-titulo text-white">
            Tu seguridad y tranquilidad son nuestra prioridad
          </h1>
          <p class="t-cuerpo text-lavanda/90 max-w-xl">
            Protección discreta que te acompaña en tus trayectos nocturnos al campus mediante alertas silenciosas, rutas iluminadas y respuesta coordinada.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <button onclick="goAuth('register')"
                    class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-cobalto font-bold text-base shadow-xl hover:bg-lavanda transition flex items-center justify-center gap-2">
              ${icon('person_add')} Crear cuenta gratuita
            </button>
            <button onclick="goAuth('login')"
                    class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-acento4 text-white font-semibold text-base border border-acento2/40 hover:bg-acento3 transition flex items-center justify-center gap-2">
              ${icon('login')} Ya tengo cuenta
            </button>
          </div>
        </div>

        <div class="lg:col-span-5 flex justify-center">
          <div class="w-full max-w-sm bg-acento4/40 border border-acento2/30 rounded-3xl p-6 shadow-2xl">
            <img src="imagen/portada.jpg" class="w-full h-auto" alt="Trayecto seguro nocturno">
            </div>
          </div>
        </div>
      </main>

      <section class="landing-carousels space-y-10 sm:space-y-12 my-10 sm:my-14">
        <div class="landing-carousel-section">
          <h2 class="text-xl sm:text-2xl font-bold text-acento1 mb-5 text-center">¿Cómo funciona?</h2>
          <div class="landing-carousel" data-carousel aria-label="Cómo funciona EllaAlerta">
            <button type="button" class="landing-carousel-arrow" data-carousel-prev aria-label="Elemento anterior">${icon('arrow_back')}</button>
            <div class="landing-carousel-track">
            <article class="landing-carousel-card bg-white text-cobalto p-7 sm:p-8 rounded-2xl shadow-lg flex items-start gap-4">
              <div class="p-2.5 rounded-xl bg-lavanda text-cobalto shrink-0">${icon('notifications_active')}</div>
              <div>
                <h3 class="font-bold text-lg">1. Alerta encubierta</h3>
                <p class="text-sm sm:text-base text-acento4 mt-2 leading-relaxed">Pide ayuda sin llamar la atención con botón SOS o patrón físico.</p>
              </div>
            </article>
            <article class="landing-carousel-card bg-white text-cobalto p-7 sm:p-8 rounded-2xl shadow-lg flex items-start gap-4">
              <div class="p-2.5 rounded-xl bg-lavanda text-cobalto shrink-0">${icon('light_mode')}</div>
              <div>
                <h3 class="font-bold text-lg">2. Rutas iluminadas</h3>
                <p class="text-sm sm:text-base text-acento4 mt-2 leading-relaxed">Elige caminos seguros con comercios activos y casetas UPC.</p>
              </div>
            </article>
            <article class="landing-carousel-card bg-white text-cobalto p-7 sm:p-8 rounded-2xl shadow-lg flex items-start gap-4">
              <div class="p-2.5 rounded-xl bg-lavanda text-cobalto shrink-0">${icon('groups')}</div>
              <div>
                <h3 class="font-bold text-lg">3. Red de confianza</h3>
                <p class="text-sm sm:text-base text-acento4 mt-2 leading-relaxed">Comparte tu trayecto en vivo con familiares y seguridad.</p>
              </div>
            </article>
            </div>
            <button type="button" class="landing-carousel-arrow" data-carousel-next aria-label="Elemento siguiente">${icon('arrow_forward')}</button>
          </div>
        </div>

        <div class="landing-carousel-section">
          <h2 class="text-xl sm:text-2xl font-bold text-acento1 mb-5 text-center">Beneficios por perfil</h2>
          <div class="landing-carousel" data-carousel aria-label="Beneficios por perfil">
            <button type="button" class="landing-carousel-arrow" data-carousel-prev aria-label="Perfil anterior">${icon('arrow_back')}</button>
            <div class="landing-carousel-track">
            <article class="landing-carousel-card bg-lavanda text-cobalto p-7 sm:p-8 rounded-2xl">
              <div class="flex items-center gap-2 font-bold text-lg mb-2">${icon('school')} Estudiantes UPC</div>
              <p class="text-sm sm:text-base text-acento4 leading-relaxed">Llega a casa con mayor tranquilidad y respaldo institucional.</p>
            </article>
            <article class="landing-carousel-card bg-lavanda text-cobalto p-7 sm:p-8 rounded-2xl">
              <div class="flex items-center gap-2 font-bold text-lg mb-2">${icon('family_restroom')} Red de Confianza</div>
              <p class="text-sm sm:text-base text-acento4 leading-relaxed">Acompaña sus recorridos nocturnos en tiempo real.</p>
            </article>
            <article class="landing-carousel-card bg-lavanda text-cobalto p-7 sm:p-8 rounded-2xl">
              <div class="flex items-center gap-2 font-bold text-lg mb-2">${icon('security')} Seguridad Patrimonial</div>
              <p class="text-sm sm:text-base text-acento4 leading-relaxed">Coordina respuestas rápidas y analiza mapas de calor.</p>
            </article>
            </div>
            <button type="button" class="landing-carousel-arrow" data-carousel-next aria-label="Perfil siguiente">${icon('arrow_forward')}</button>
          </div>
        </div>
      </section>

      <footer class="mt-10 pt-6 border-t border-acento2/20 flex flex-col sm:flex-row items-center justify-between gap-4 t-pequeno text-acento1">
        <div>Soporte 24/7: central@ellaalerta.pe · Línea 100 · Policía 105</div>
        <div class="flex items-center gap-4">
          
          <span>Términos y Política de Privacidad</span>
        </div>
      </footer>
    </div>
  `;
}

function renderAuth() {
  const isReg = state.authMode === 'register';

  return `
    <div class="min-h-screen flex flex-col max-w-6xl mx-auto w-full px-5 py-6 sm:px-8">
      <header class="flex items-center justify-between">
        <button onclick="setScreen('landing')" class="flex items-center gap-2.5 text-white hover:text-acento1 transition">
          ${icon('arrow_back')}
          ${LOGO_IMG}
          <span class="text-xl font-bold">EllaAlerta</span>
        </button>
        
      </header>
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6">
        <div class="hidden lg:block lg:col-span-5 space-y-4">
          <h1 class="t-titulo">Tu seguridad y tranquilidad son nuestra prioridad</h1>
          <p class="t-cuerpo text-lavanda/85">
            Protección discreta que te acompaña en tus trayectos nocturnos al campus.
          </p>
          
        </div>

        <div class="lg:col-span-7 w-full max-w-xl mx-auto">
          <div class="grid grid-cols-2 p-1.5 rounded-full bg-acento4 mb-6 shadow-inner">
            <button onclick="switchAuthMode('login')"
                    class="py-2.5 rounded-full font-bold text-sm sm:text-base transition ${!isReg ? 'bg-white text-cobalto shadow' : 'text-lavanda hover:text-white'}">
              Iniciar Sesión
            </button>
            <button onclick="switchAuthMode('register')"
                    class="py-2.5 rounded-full font-bold text-sm sm:text-base transition ${isReg ? 'bg-white text-cobalto shadow' : 'text-lavanda hover:text-white'}">
              Crear Cuenta
            </button>
          </div>

          ${!isReg ? `
            <form onsubmit="handleLogin(event)" class="bg-white text-cobalto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div>
                <label class="block text-sm font-bold mb-1.5">Correo electrónico</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-3 text-acento3">${icon('mail', 'text-xl')}</span>
                  <input type="email" name="correo" required placeholder="u2025xxxxx@upc.edu.pe"
                         class="w-full pl-11 pr-4 py-3 rounded-xl bg-lavanda/60 border border-acento1 text-cobalto focus:outline-none focus:border-cobalto" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold mb-1.5">Contraseña</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-3 text-acento3">${icon('lock', 'text-xl')}</span>
                  <input type="password" id="login-pass" name="clave" required placeholder="••••••••"
                         class="w-full pl-11 pr-11 py-3 rounded-xl bg-lavanda/60 border border-acento1 text-cobalto focus:outline-none focus:border-cobalto" />
                  <button type="button" onclick="togglePassVisibility('login-pass')" class="absolute right-3.5 top-3 text-acento3 hover:text-cobalto">
                    ${icon('visibility', 'text-xl')}
                  </button>
                </div>
                <div class="text-right mt-1.5">
                  <button type="button" onclick="toast('Se ha enviado un enlace de recuperación a tu correo registrado.')" class="t-pequeno text-acento4 underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold mb-1.5">Perfil de acceso rápido (opcional)</label>
                <select onchange="autofillDemo(this.value)" class="w-full px-4 py-3 rounded-xl bg-lavanda/60 border border-acento1 text-cobalto text-sm">
                  <option value="">Selecciona un perfil para autocompletar demo...</option>
                  <option value="estudiante">Perfil: Estudiante UPC</option>
                  <option value="apoyo">Perfil: Red de apoyo</option>
                  <option value="seguridad">Perfil: Seguridad Patrimonial</option>
                  <option value="admin">Perfil: Grupo Principal (Intranet Admin)</option>
                </select>
              </div>

              <p id="auth-error" class="text-alertaRojo text-sm font-semibold hidden"></p>

              <button type="submit" class="w-full py-3.5 rounded-2xl bg-acento1 hover:bg-cobalto hover:text-white text-cobalto font-bold text-base shadow-md transition">
                Ingresar
              </button>
            </form>
          ` : state.regStep === 1 ? `
            <div class="space-y-4">
              <div class="text-center sm:text-left">
                <h2 class="t-subtitulo">Selecciona tu perfil</h2>
                <p class="t-pequeno text-lavanda">¿Cómo vas a utilizar EllaAlerta? Esto definirá tus herramientas y permisos.</p>
              </div>

              <div class="grid grid-cols-1 gap-3.5">
                ${[
                  { id: 'estudiante', title: 'Estudiante UPC', iconName: 'school', desc: 'Activa alertas discretas, rutas iluminadas y comparte tu trayecto. Requiere correo @upc.edu.pe.' },
                  { id: 'apoyo', title: 'Red de Apoyo', iconName: 'groups', desc: 'Recibe alertas críticas en sala de crisis y acompaña los recorridos de tus contactos.' },
                  { id: 'seguridad', title: 'Seguridad Patrimonial', iconName: 'security', desc: 'Monitorea incidencias en tiempo real y gestiona zonas críticas del campus.' }
                ].map(p => {
                  const selected = state.regPerfil === p.id;
                  return `
                    <button type="button" onclick="selectRegPerfil('${p.id}')"
                            class="text-left p-5 rounded-2xl transition border-2 flex items-start justify-between gap-4 ${selected ? 'bg-white text-cobalto border-acento1 shadow-xl' : 'bg-lavanda/90 text-cobalto border-transparent opacity-90 hover:opacity-100'}">
                      <div class="flex items-start gap-3.5">
                        <div class="p-2.5 rounded-xl bg-cobalto text-white shrink-0">${icon(p.iconName)}</div>
                        <div>
                          <h3 class="font-bold text-base sm:text-lg">${p.title}</h3>
                          <p class="t-pequeno text-acento4 mt-1">${p.desc}</p>
                        </div>
                      </div>
                      <span class="text-cobalto">${icon(selected ? 'check_circle' : 'radio_button_unchecked')}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <button onclick="setRegStep(2)" class="w-full py-3.5 rounded-2xl bg-acento1 hover:bg-white text-cobalto font-bold text-base shadow-lg transition mt-2">
                Continuar
              </button>
            </div>
          ` : `
            <form onsubmit="handleRegister(event)" class="bg-white text-cobalto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div class="flex items-center justify-between border-b border-lavanda pb-3">
                <div>
                  <span class="t-pequeno text-acento3 font-bold uppercase">Perfil seleccionado</span>
                  <h3 class="font-bold text-lg text-cobalto">${ROLES[state.regPerfil]}</h3>
                </div>
                <button type="button" onclick="setRegStep(1)" class="text-xs px-3 py-1.5 rounded-xl bg-lavanda text-cobalto font-semibold hover:bg-acento1">
                  Cambiar perfil
                </button>
              </div>

              <div>
                <label class="block text-sm font-bold mb-1">Nombre completo</label>
                <input type="text" name="nombre" required placeholder="Ej. Daniela Mendoza"
                       class="w-full px-4 py-3 rounded-xl bg-lavanda/60 border border-acento1 text-cobalto focus:outline-none focus:border-cobalto" />
              </div>

              <div>
                <label class="block text-sm font-bold mb-1">
                  Correo electrónico ${state.regPerfil === 'estudiante' ? '<span class="text-alertaRojo">*(@upc.edu.pe)</span>' : ''}
                </label>
                <input type="email" name="correo" required
                       placeholder="${state.regPerfil === 'estudiante' ? 'u2025xxxxx@upc.edu.pe' : 'correo@ejemplo.com'}"
                       class="w-full px-4 py-3 rounded-xl bg-lavanda/60 border border-acento1 text-cobalto focus:outline-none focus:border-cobalto" />
              </div>

              <div>
                <label class="block text-sm font-bold mb-1">Contraseña (mínimo 8 caracteres)</label>
                <input type="password" name="clave" minlength="8" required placeholder="••••••••"
                       class="w-full px-4 py-3 rounded-xl bg-lavanda/60 border border-acento1 text-cobalto focus:outline-none focus:border-cobalto" />
              </div>

              <label class="flex items-start gap-2.5 t-pequeno text-acento4 cursor-pointer pt-1">
                <input type="checkbox" required class="mt-1 rounded accent-cobalto" />
                <span>Acepto los Términos, Política de Privacidad y el consentimiento informado de ubicación en emergencias.</span>
              </label>

              <p id="auth-error" class="text-alertaRojo text-sm font-semibold hidden"></p>

              <div class="flex gap-3 pt-2">
                <button type="button" onclick="setRegStep(1)" class="px-5 py-3 rounded-2xl bg-lavanda text-cobalto font-bold">
                  Atrás
                </button>
                <button type="submit" class="flex-1 py-3 rounded-2xl bg-cobalto text-white font-bold shadow-lg hover:bg-acento4 transition">
                  Finalizar Registro
                </button>
              </div>
            </form>
          `}

          <p class="text-center t-pequeno text-acento1 mt-5">
            Al ingresar, aceptas nuestros <span class="underline">Términos</span> y <span class="underline">Política de Privacidad</span>
          </p>
        </div>
      </div>
    </div>
  `;
}

function setScreen(scr) { state.screen = scr; render(); }

function goAuth(mode) { state.screen = 'auth'; state.authMode = mode; state.regStep = 1; render(); }

function switchAuthMode(mode) { state.authMode = mode; state.regStep = 1; render(); }

function selectRegPerfil(p) { state.regPerfil = p; render(); }

function setRegStep(step) { state.regStep = step; render(); }

function togglePassVisibility(inputId) {
  const inp = document.getElementById(inputId);
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

function autofillDemo(perfil) {
  const form = document.querySelector('form');
  if (!form || !perfil) return;
  const map = {
    estudiante: ['u202512345@upc.edu.pe', '12345678'],
    apoyo: ['yeison.apoyo@gmail.com', '12345678'],
    seguridad: ['seguridad.sanmiguel@upc.edu.pe', '12345678'],
    admin: ['admin@ellaalerta.pe', 'Admin123']
  };
  if (map[perfil]) {
    form.correo.value = map[perfil][0];
    form.clave.value = map[perfil][1];
  }
}

async function quickDemoLogin(correo, clave) {
  const u = DB.get('usuarios').find(x => x.correo === correo);
  if (u && u.clave === await hashClave(clave)) {
    entrarAlPanel(u, `Bienvenido, ${u.nombre}`);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const f = e.target;
  const correo = f.correo.value.trim().toLowerCase();
  const claveHash = await hashClave(f.clave.value);
  const errEl = $('#auth-error');

  const u = DB.get('usuarios').find(x => x.correo === correo);
  if (!u || u.clave !== claveHash) {
    errEl.textContent = 'Correo o contraseña incorrectos. Verifica tus datos.';
    errEl.classList.remove('hidden');
    return;
  }
  if (!u.activo) {
    errEl.textContent = 'Tu cuenta está pendiente de aprobación por el Grupo Principal (Administración).';
    errEl.classList.remove('hidden');
    return;
  }

  entrarAlPanel(u, `Sesión iniciada como ${ROLES[u.rol]}`);
}

async function handleRegister(e) {
  e.preventDefault();
  const f = e.target;
  const rol = state.regPerfil;
  const nombre = f.nombre.value.trim();
  const correo = f.correo.value.trim().toLowerCase();
  const errEl = $('#auth-error');

  if (rol === 'estudiante' && !correo.endsWith('@upc.edu.pe')) {
    errEl.textContent = 'Las estudiantes deben registrarse con su correo institucional @upc.edu.pe.';
    errEl.classList.remove('hidden');
    return;
  }
  if (DB.get('usuarios').some(u => u.correo === correo)) {
    errEl.textContent = 'Este correo ya está registrado. Inicia sesión.';
    errEl.classList.remove('hidden');
    return;
  }

  const nuevoUsuario = DB.add('usuarios', {
    nombre,
    correo,
    clave: await hashClave(f.clave.value),
    rol,
    activo: rol !== 'seguridad',
    creado: nowISO()
  });

  if (!nuevoUsuario.activo) {
    state.authMode = 'login';
    state.regStep = 1;
    render();
    toast('Cuenta de Seguridad creada. Administración debe aprobarla antes de ingresar.', 'info');
    return;
  }

  entrarAlPanel(nuevoUsuario, `¡Bienvenida a EllaAlerta, ${nombre}!`);
}


function render() {
  const root = $('#app');
  if (!root) return;
  landingCarouselTimers.forEach(timer => clearInterval(timer));
  landingCarouselTimers = [];
  root.innerHTML = state.screen === 'auth' ? renderAuth() : renderLanding();
  if (state.screen !== 'auth') initLandingCarousels();
}

function initLandingCarousels() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.landing-carousel-track');
    const slides = Array.from(track.children);
    let activeIndex = 0;
    let timer = null;
    let scrollUpdatePending = false;

    const goTo = index => {
      activeIndex = (index + slides.length) % slides.length;
      const target = track.scrollLeft + slides[activeIndex].getBoundingClientRect().left - track.getBoundingClientRect().left;
      track.scrollTo({ left: target, behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    const startAutoplay = () => {
      if (reducedMotion || timer) return;
      timer = setInterval(() => goTo(activeIndex + 1), 5000);
      landingCarouselTimers.push(timer);
    };

    track.addEventListener('scroll', () => {
      if (scrollUpdatePending) return;
      scrollUpdatePending = true;
      requestAnimationFrame(() => {
        const trackLeft = track.getBoundingClientRect().left;
        activeIndex = slides.reduce((nearestIndex, slide, index) => {
          const nearestSlide = slides[nearestIndex];
          return Math.abs(slide.getBoundingClientRect().left - trackLeft) <
            Math.abs(nearestSlide.getBoundingClientRect().left - trackLeft) ? index : nearestIndex;
        }, 0);
        scrollUpdatePending = false;
      });
    });

    carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => goTo(activeIndex - 1));
    carousel.querySelector('[data-carousel-next]').addEventListener('click', () => goTo(activeIndex + 1));

    startAutoplay();
  });
}
(async function initInicio() {
  await seedDatabase();
  try {
const u = DB.get('usuarios').find(x => x.id === sessionStorage.getItem('ea_uid'));
if (u && u.activo) { location.replace(paginaDeRol(u.rol)); return; }
  } catch {}
  render();
})();
