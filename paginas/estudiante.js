/* EllaAlerta — funciones del rol "estudiante" (se conecta con paginas/estudiante.html) */
function viewEstudianteRutas() {
  const trayectoActivo = DB.get('trayectos').find(t => t.uid === state.user.id && t.estado === 'en trayecto');

  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-5 bg-white text-cobalto rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div class="bg-cobalto text-white p-4 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-acento1 text-cobalto font-bold flex items-center justify-center">
              ${esc(state.user.nombre.charAt(0))}
            </div>
            <div>
              <h2 class="font-bold text-base">Hola, ${esc(state.user.nombre.split(' ')[0])}</h2>
              <p class="text-xs text-acento1 flex items-center gap-1">${icon('location_on', 'text-sm')} UPC San Miguel</p>
            </div>
          </div>
          <button onclick="setTab('config')" class="p-2 rounded-xl bg-acento4 hover:bg-acento3" title="Configuración rápida">
            ${icon('tune', 'text-lg')}
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-acento4 mb-1.5">¿A dónde vas?</label>
          <div class="relative">
            <span class="absolute left-3.5 top-3 text-acento3">${icon('search', 'text-xl')}</span>
            <input type="text" value="${esc(state.destino)}" oninput="state.destino = this.value"
                   placeholder="Ej. Paradero Av. La Marina"
                   class="w-full pl-11 pr-4 py-3 rounded-xl bg-lavanda border border-acento1 text-cobalto text-sm font-medium focus:outline-none focus:border-cobalto" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button onclick="setRutaTipo('iluminada')"
                  class="p-3.5 rounded-2xl border-2 text-left transition ${state.rutaTipo === 'iluminada' ? 'bg-lavanda border-cobalto shadow' : 'bg-white border-lavanda hover:border-acento1'}">
            <div class="flex items-center justify-between mb-1">
              ${icon('light_mode', 'text-cobalto')}
              ${state.rutaTipo === 'iluminada' ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-cobalto text-white font-bold">Activa</span>' : ''}
            </div>
            <p class="font-bold text-sm">Ruta Iluminada</p>
            <p class="text-[11px] text-acento4">Más luz y comercios</p>
          </button>

          <button onclick="setRutaTipo('corta')"
                  class="p-3.5 rounded-2xl border-2 text-left transition ${state.rutaTipo === 'corta' ? 'bg-lavanda border-cobalto shadow' : 'bg-white border-lavanda hover:border-acento1'}">
            <div class="flex items-center justify-between mb-1">
              ${icon('directions_walk', 'text-cobalto')}
              ${state.rutaTipo === 'corta' ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-cobalto text-white font-bold">Activa</span>' : ''}
            </div>
            <p class="font-bold text-sm">Ruta Corta</p>
            <p class="text-[11px] text-acento4">Menor distancia</p>
          </button>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-acento4 mb-2.5">Puntos Seguros cercanos</h3>
          <div class="space-y-2">
            ${[
              { name: 'Caseta UPC Puerta 2', meta: '80 m · Vigilancia 24h', badge: 'Abierto', color: 'text-seguroVerde bg-emerald-50' },
              { name: 'Tambo Av. La Marina', meta: '150 m · Comercio iluminado', badge: '24 h', color: 'text-cobalto bg-lavanda' },
              { name: 'Clínica San Gabriel', meta: '380 m · Atención médica', badge: '24 h', color: 'text-cobalto bg-lavanda' }
            ].map(ps => `
              <div class="flex items-center justify-between p-3 rounded-xl bg-lavanda/60 border border-acento1/50">
                <div>
                  <p class="font-bold text-sm">${ps.name}</p>
                  <p class="text-xs text-acento4">${ps.meta}</p>
                </div>
                <span class="text-[11px] font-bold px-2.5 py-1 rounded-full ${ps.color}">${ps.badge}</span>
              </div>
            `).join('')}
          </div>
        </div>

        ${trayectoActivo ? `
          <div class="p-4 rounded-2xl bg-emerald-50 border border-seguroVerde/40 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-seguroVerde flex items-center gap-1">${icon('share_location', 'text-base')} Trayecto compartido en vivo</span>
              <span class="text-xs font-bold text-cobalto">ETA 14 min</span>
            </div>
            <p class="text-xs text-cobalto">Destino: <b>${esc(trayectoActivo.destino)}</b></p>
            <button onclick="finalizarTrayecto()" class="w-full py-3 rounded-xl bg-seguroVerde text-white font-bold text-sm shadow hover:opacity-95">
              Llegué a salvo · Finalizar trayecto
            </button>
          </div>
        ` : `
          <button onclick="iniciarTrayecto()" class="w-full py-3.5 rounded-2xl bg-cobalto hover:bg-acento4 text-white font-bold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition">
            ${icon('shield')} Iniciar trayecto acompañado
          </button>
        `}
      </div>

      <div class="lg:col-span-7 space-y-4">
        ${renderMapaSVG(state.rutaTipo, false)}

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-acento4/50 border border-acento2/30 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p class="text-xs text-acento1">Red de confianza vinculada</p>
              <p class="font-bold text-base">${DB.get('red').filter(r => r.uid === state.user.id).length} contactos activos</p>
            </div>
            <button onclick="setTab('red')" class="px-3.5 py-2 rounded-xl bg-white text-cobalto text-xs font-bold">
              Gestionar
            </button>
          </div>
          <div class="bg-acento4/50 border border-acento2/30 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p class="text-xs text-acento1">Alerta física silenciosa</p>
              <p class="font-bold text-base truncate">${esc(state.patronActivo)}</p>
            </div>
            <button onclick="setTab('config')" class="px-3.5 py-2 rounded-xl bg-acento1 text-cobalto text-xs font-bold">
              Entrenar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function viewEstudianteSOS() {
  return `
    <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-4">
      <div class="md:col-span-6 flex flex-col items-center text-center space-y-5">
        <button id="sos-main-btn"
                onpointerdown="startSosHold()"
                onpointerup="cancelSosHold()"
                onpointerleave="cancelSosHold()"
                oncontextmenu="return false"
                class="sos-btn flex flex-col items-center justify-center text-white cursor-pointer"
                aria-label="Mantén presionado 2 segundos para enviar alerta SOS">
          <span class="sos-ring"></span>
          <span class="text-4xl font-bold tracking-wider">SOS</span>
          <span class="text-xs opacity-90 mt-1">Mantener 2s</span>
        </button>
        <div>
          <p class="font-bold text-lg">Mantén presionado 2 seg</p>
          <p class="t-pequeno text-acento1 max-w-xs mx-auto">
            Envía tu ubicación GPS exacta, nivel de batería y audio ambiental a tu Red de Confianza y Seguridad UPC.
          </p>
        </div>
      </div>

      <div class="md:col-span-6 bg-white text-cobalto rounded-3xl p-6 shadow-2xl space-y-5">
        <h2 class="font-bold text-lg">Tipo de emergencia</h2>
        <div class="grid grid-cols-2 gap-3">
          ${[
            { id: 'Acoso', iconName: 'warning' },
            { id: 'Robo', iconName: 'gpp_maybe' },
            { id: 'Accidente', iconName: 'medical_services' },
            { id: 'Malestar', iconName: 'sick' }
          ].map(t => {
            const selected = state.emergenciaTipo === t.id;
            return `
              <button onclick="setEmergenciaTipo('${t.id}')"
                      class="p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 font-bold text-sm transition ${
                        selected ? 'bg-cobalto text-white border-cobalto shadow-md' : 'bg-lavanda/70 text-cobalto border-transparent hover:border-acento1'
                      }">
                ${icon(t.iconName, 'text-2xl')}
                <span>${t.id}</span>
              </button>
            `;
          }).join('')}
        </div>

        <button onclick="toggleSigilo()"
                class="w-full py-3.5 px-4 rounded-2xl bg-lavanda hover:bg-acento1 text-cobalto font-bold text-sm flex items-center justify-center gap-2 transition">
          ${icon('visibility_off')}
          <span>Activar Modo Camuflaje (Pantalla Oscura)</span>
        </button>

        <button onclick="setTab('rutas')"
                class="w-full py-3 rounded-2xl bg-acento1/60 hover:bg-acento1 text-cobalto font-semibold text-sm flex items-center justify-center gap-2">
          <span>Continuar al mapa</span>
          ${icon('arrow_forward', 'text-lg')}
        </button>
      </div>
    </div>
  `;
}

function viewEstudianteReportar() {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-5 space-y-4">
        <div>
          <h1 class="t-titulo">Reporte Rápido</h1>
          <p class="t-pequeno text-acento1">Tu identidad está protegida por defecto ante Seguridad Patrimonial.</p>
        </div>
        ${renderMapaSVG('iluminada', false)}
        <div class="bg-white text-cobalto p-4 rounded-2xl flex items-center justify-between shadow">
          <div class="flex items-center gap-2.5">
            ${icon('location_on', 'text-cobalto')}
            <div>
              <p class="text-xs text-acento4">Ubicación detectada</p>
              <p class="text-sm font-bold" id="rep-ubic-label">Av. La Marina · UPC San Miguel</p>
            </div>
          </div>
          <button type="button" onclick="cambiarUbicacionReporte()" class="text-xs font-bold underline text-cobalto">
            Cambiar
          </button>
        </div>
      </div>

      <form onsubmit="handleEnviarReporte(event)" class="lg:col-span-7 bg-lavanda text-cobalto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div>
          <label class="block text-sm font-bold mb-2">Tipo de incidente</label>
          <select name="tipo" class="w-full px-4 py-3.5 rounded-2xl bg-white border border-acento1 text-cobalto font-semibold focus:outline-none">
            <option value="Acoso callejero">Acoso callejero</option>
            <option value="Poca iluminación">Poca iluminación / Poste apagado</option>
            <option value="Seguimiento sospechoso">Seguimiento sospechoso</option>
            <option value="Robo o intento de hurto">Robo o intento de hurto</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-bold mb-2">Ubicación exacta o referencia</label>
          <input type="text" id="rep-ubic-input" name="ubic" value="Av. La Marina · UPC San Miguel" required
                 class="w-full px-4 py-3 rounded-2xl bg-white border border-acento1 text-cobalto text-sm" />
        </div>

        <div>
          <label class="block text-sm font-bold mb-2">Detalles opcionales (ej. poca luz, paradero solo)...</label>
          <textarea name="det" rows="4" placeholder="Describe brevemente lo sucedido para alertar a la comunidad..."
                    class="w-full p-4 rounded-2xl bg-white border border-acento1 text-cobalto text-sm focus:outline-none"></textarea>
        </div>

        <div class="flex items-center justify-between bg-white p-4 rounded-2xl">
          <div class="flex items-center gap-2.5">
            ${icon('verified_user', 'text-cobalto')}
            <span class="text-sm font-bold">Enviar de forma anónima</span>
          </div>
          <input type="checkbox" name="anon" checked class="w-5 h-5 accent-cobalto cursor-pointer" />
        </div>

        <button type="submit" class="w-full py-4 rounded-2xl bg-cobalto hover:bg-acento4 text-white font-bold text-base shadow-lg transition">
          Enviar reporte comunitario
        </button>
      </form>
    </div>
  `;
}

function viewEstudianteRed() {
  const contactos = DB.get('red').filter(c => c.uid === state.user.id);
  const usuarios = DB.get('usuarios');

  return `
    <div class="space-y-6">
      <div>
        <h1 class="t-titulo">Administrar red de confianza</h1>
        <p class="t-pequeno text-acento1">${contactos.length} contactos registrados · Reciben tus alertas SOS y trayectos.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 bg-lavanda text-cobalto rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-xl">
          <h2 class="font-bold text-lg">Contactos registrados</h2>
          ${contactos.length === 0 ? `
            <p class="text-sm text-acento4 py-4">Aún no tienes contactos registrados. Añade a un familiar o amigo.</p>
          ` : contactos.map(c => {
            const vinculado = usuarios.some(u => u.correo === c.contacto && u.rol === 'apoyo');
            return `
              <div class="bg-white p-4 rounded-2xl shadow-xs flex items-center justify-between gap-3">
                <div class="flex items-center gap-3.5 min-w-0">
                  <div class="w-11 h-11 rounded-full bg-acento1 text-cobalto font-bold flex items-center justify-center shrink-0">
                    ${esc(c.nombre.charAt(0).toUpperCase())}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-bold text-sm sm:text-base truncate">${esc(c.nombre)}</p>
                      ${c.primeraResp ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-cobalto text-white font-bold">Primera Respuesta</span>' : ''}
                    </div>
                    <p class="text-xs text-acento4 truncate">${esc(c.rel)} · ${esc(c.contacto)}</p>
                    <span class="inline-block mt-1 text-[11px] font-semibold ${vinculado ? 'text-seguroVerde' : 'text-alertaAmbar'}">
                      ${vinculado ? '● Cuenta de Apoyo Vinculada' : '● Invitación enviada'}
                    </span>
                  </div>
                </div>
                <button onclick="eliminarContacto('${c.id}')" class="p-2 rounded-xl bg-red-50 text-alertaRojo hover:bg-alertaRojo hover:text-white transition" title="Eliminar contacto">
                  ${icon('delete', 'text-lg')}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <form onsubmit="handleAgregarContacto(event)" class="lg:col-span-5 bg-white text-cobalto rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 class="font-bold text-lg">Crear nuevo contacto</h2>

          <div>
            <label class="block text-xs font-bold text-acento4 mb-1">Nombre y apellido</label>
            <input type="text" name="nombre" required placeholder="Ej. Mayra Rodríguez"
                   class="w-full px-4 py-3 rounded-xl bg-lavanda/70 border border-acento1 text-sm" />
          </div>

          <div>
            <label class="block text-xs font-bold text-acento4 mb-1">Relación / Parentesco</label>
            <select name="rel" class="w-full px-4 py-3 rounded-xl bg-lavanda/70 border border-acento1 text-sm font-semibold">
              <option value="Familiar">Familiar</option>
              <option value="Amigo">Amigo / Amiga</option>
              <option value="Compañero">Compañero UPC</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-acento4 mb-1">Correo con el que ingresa a EllaAlerta</label>
            <input type="email" name="contacto" required placeholder="yeison.apoyo@gmail.com"
                   class="w-full px-4 py-3 rounded-xl bg-lavanda/70 border border-acento1 text-sm" />
          </div>

          <div>
            <label class="block text-xs font-bold text-acento4 mb-1">Número de celular</label>
            <input type="tel" name="celular" placeholder="976 543 129"
                   class="w-full px-4 py-3 rounded-xl bg-lavanda/70 border border-acento1 text-sm" />
          </div>

          <label class="flex items-center justify-between p-3 rounded-xl bg-lavanda cursor-pointer">
            <span class="text-xs font-bold">Prioridad: Primera respuesta</span>
            <input type="checkbox" name="primeraResp" class="w-4 h-4 accent-cobalto" />
          </label>

          <button type="submit" class="w-full py-3.5 rounded-2xl bg-cobalto hover:bg-acento4 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2">
            ${icon('person_add')} Añadir contacto
          </button>
        </form>
      </div>
    </div>
  `;
}

function viewEstudianteHistorial() {
  const alertas = DB.get('alertas').filter(a => a.uid === state.user.id);
  const reportes = DB.get('reportes').filter(r => r.uid === state.user.id);

  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="t-titulo">Historial de Alertas y Reportes</h1>
          <p class="t-pequeno text-acento1">Registro auditado de tus activaciones SOS y reportes comunitarios.</p>
        </div>
        <div class="flex gap-2 bg-acento4 p-1 rounded-full self-start">
          ${['Todos', 'Alertas', 'Reportes'].map(f => `
            <button onclick="state.historialFiltro='${f}'; render();"
                    class="px-4 py-1.5 rounded-full text-xs font-bold transition ${state.historialFiltro === f ? 'bg-white text-cobalto' : 'text-lavanda'}">
              ${f}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="space-y-3">
        ${(state.historialFiltro !== 'Reportes' ? alertas : []).map(a => `
          <div class="bg-white text-cobalto p-4 sm:p-5 rounded-2xl shadow flex items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="p-3 rounded-2xl bg-red-100 text-alertaRojo">${icon('emergency')}</div>
              <div>
                <p class="font-bold text-base">Alerta SOS / ${esc(a.tipo)}</p>
                <p class="text-xs text-acento4">${formatFecha(a.fecha)} · ${esc(a.ubicacion || 'UPC San Miguel')}</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${a.estado === 'activa' ? 'bg-alertaRojo text-white' : 'bg-emerald-100 text-seguroVerde'}">
              ${a.estado === 'activa' ? 'Activa' : 'Finalizada'}
            </span>
          </div>
        `).join('')}

        ${(state.historialFiltro !== 'Alertas' ? reportes : []).map(r => `
          <div class="bg-white text-cobalto p-4 sm:p-5 rounded-2xl shadow flex items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="p-3 rounded-2xl bg-lavanda text-cobalto">${icon('flag')}</div>
              <div>
                <p class="font-bold text-base">Reporte / ${esc(r.tipo)}</p>
                <p class="text-xs text-acento4">${formatFecha(r.fecha)} · ${esc(r.ubic)}</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-lavanda text-cobalto">
              ${esc(r.estado)}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function viewEstudianteConfig() {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-6 bg-white text-cobalto rounded-3xl p-6 shadow-2xl space-y-5">
        <h2 class="t-subtitulo">Configuración y Discreción</h2>
        <p class="t-pequeno text-acento4">Configura el patrón de botones físicos para activar la alerta sin mirar la pantalla.</p>

        <div class="space-y-2.5">
          <p class="text-xs font-bold uppercase text-acento4">Patrones predefinidos</p>
          ${[
            { id: 'Patrón 1 (Vol+ Vol+ Vol-)', keys: ['Vol +', 'Vol +', 'Vol -'] },
            { id: 'Patrón 2 (Vol- Vol+ Vol-)', keys: ['Vol -', 'Vol +', 'Vol -'] },
            { id: 'Patrón 3 (Encendido x3)', keys: ['Power', 'Power', 'Power'] }
          ].map(p => `
            <button onclick="state.patronActivo='${p.id}'; render(); toast('Patrón guardado: ${p.id}');"
                    class="w-full p-3.5 rounded-2xl border-2 flex items-center justify-between ${state.patronActivo === p.id ? 'bg-lavanda border-cobalto' : 'bg-white border-lavanda'}">
              <span class="font-bold text-sm">${p.id}</span>
              <div class="flex gap-1.5">
                ${p.keys.map(k => `<span class="px-2.5 py-1 rounded-lg bg-cobalto text-white text-xs font-bold">${k}</span>`).join('')}
              </div>
            </button>
          `).join('')}
        </div>

        <div class="pt-3 border-t border-lavanda space-y-3">
          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-lavanda/60">
            <div>
              <p class="font-bold text-sm">Acceso a ubicación en tiempo real</p>
              <p class="text-xs text-acento4">Compartido solo durante trayectos o alertas SOS</p>
            </div>
            <input type="checkbox" ${state.ubicacionCompartida ? 'checked' : ''}
                   onchange="state.ubicacionCompartida=this.checked; toast(this.checked ? 'Ubicación activada' : 'Ubicación revocada');"
                   class="w-5 h-5 accent-cobalto" />
          </div>
        </div>
      </div>

      <div class="lg:col-span-6 bg-lavanda text-cobalto rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-5">
        <div class="space-y-2">
          <span class="inline-block px-3 py-1 rounded-full bg-cobalto text-white text-xs font-bold">Modo simulación segura</span>
          <h2 class="t-subtitulo">Entrena tu alerta discreta</h2>
          <p class="t-pequeno text-acento4">
            Practica ejecutar tu patrón (${esc(state.patronActivo)}) 3 veces seguidas sin enviar alertas reales.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 text-center space-y-4 shadow-inner">
          <div class="w-16 h-28 mx-auto rounded-2xl border-4 border-cobalto flex flex-col items-center justify-center relative bg-lavanda/40">
            <span class="absolute -left-2.5 top-6 w-1.5 h-5 bg-alertaRojo rounded-l animate-pulse"></span>
            <span class="absolute -left-2.5 top-13 w-1.5 h-5 bg-cobalto rounded-l"></span>
            ${icon('vibration', 'text-3xl text-cobalto')}
            <span class="text-[9px] font-bold mt-1">EllaAlerta</span>
          </div>

          <div>
            <p class="text-xs font-bold text-acento4 mb-2">Aciertos seguidos: ${state.entrenamientoHits} / 3</p>
            <div class="flex justify-center gap-3">
              ${[1, 2, 3].map(n => `
                <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${state.entrenamientoHits >= n ? 'bg-cobalto text-white' : 'bg-lavanda text-acento3'}">
                  ${state.entrenamientoHits >= n ? '✓' : n}
                </div>
              `).join('')}
            </div>
          </div>

          <button onclick="simularAciertoPatron()"
                  class="w-full py-3.5 rounded-2xl bg-cobalto hover:bg-acento4 text-white font-bold text-sm shadow transition">
            Simular ejecución de patrón físico
          </button>
        </div>
      </div>
    </div>
  `;
}

function setRutaTipo(t) { state.rutaTipo = t; render(); }

function setEmergenciaTipo(t) { state.emergenciaTipo = t; render(); }

function iniciarTrayecto() {
  DB.add('trayectos', {
    uid: state.user.id,
    destino: state.destino || 'Paradero Av. La Marina',
    ruta: state.rutaTipo,
    estado: 'en trayecto',
    inicio: nowISO(),
    bateria: 84,
    eta: state.rutaTipo === 'iluminada' ? '14 min' : '9 min'
  });
  toast('Trayecto acompañado iniciado. Tu red de confianza puede monitorearte.', 'ok');
  render();
}

function finalizarTrayecto() {
  DB.set('trayectos', DB.get('trayectos').map(t => t.uid === state.user.id ? { ...t, estado: 'finalizado' } : t));
  toast('Trayecto finalizado. ¡Nos alegra que hayas llegado bien!', 'ok');
  render();
}

let sosHoldTimer = null;

function startSosHold() {
  const btn = $('#sos-main-btn');
  if (btn) btn.classList.add('holding');
  clearTimeout(sosHoldTimer);
  sosHoldTimer = setTimeout(() => {
    triggerSOSAlert();
  }, 2000);
}

function cancelSosHold() {
  clearTimeout(sosHoldTimer);
  const btn = $('#sos-main-btn');
  if (btn) btn.classList.remove('holding');
}

function triggerSOSAlert() {
  cancelSosHold();
  if (!state.user) return;
  DB.add('alertas', {
    uid: state.user.id,
    nombre: state.user.nombre,
    tipo: state.emergenciaTipo,
    ubicacion: 'Av. La Marina · UPC San Miguel',
    estado: 'activa',
    fecha: nowISO(),
    resp: []
  });
  navigator.vibrate?.([200, 100, 200]);
  toast('¡ALERTA SOS ENVIADA! Tu red de confianza y Seguridad UPC fueron notificadas.', 'error');
  render();
}

function toggleSigilo() {
  const overlay = $('#stealth-overlay');
  if (!overlay) return;
  const isHidden = overlay.classList.contains('hidden');
  if (isHidden) {
    overlay.classList.remove('hidden');
    document.body.classList.add('modo-sigilo');
  } else {
    overlay.classList.add('hidden');
    document.body.classList.remove('modo-sigilo');
  }
}

function cambiarUbicacionReporte() {
  const puntos = [
    'Av. La Marina · UPC San Miguel',
    'Av. Universitaria cruce La Marina',
    'Paradero Escardó · San Miguel',
    'Puerta 2 UPC · Calle Alonso de Molina'
  ];
  const inp = $('#rep-ubic-input');
  const lbl = $('#rep-ubic-label');
  const next = puntos[(puntos.indexOf(inp.value) + 1) % puntos.length];
  inp.value = next;
  lbl.textContent = next;
}

function handleEnviarReporte(e) {
  e.preventDefault();
  const f = e.target;
  DB.add('reportes', {
    uid: state.user.id,
    anon: f.anon.checked,
    tipo: f.tipo.value,
    ubic: f.ubic.value.trim(),
    det: f.det.value.trim(),
    fecha: nowISO(),
    estado: 'nuevo'
  });
  f.reset();
  toast('Reporte comunitario enviado. Gracias por cuidar a la comunidad.', 'ok');
  setTab('rutas');
}

function handleAgregarContacto(e) {
  e.preventDefault();
  const f = e.target;
  DB.add('red', {
    uid: state.user.id,
    nombre: f.nombre.value.trim(),
    rel: f.rel.value,
    contacto: f.contacto.value.trim().toLowerCase(),
    celular: f.celular.value.trim(),
    primeraResp: f.primeraResp.checked
  });
  toast('Contacto añadido a tu red de confianza.', 'ok');
  render();
}

function eliminarContacto(id) {
  DB.del('red', id);
  toast('Contacto eliminado de tu red.');
  render();
}

function simularAciertoPatron() {
  state.entrenamientoHits = (state.entrenamientoHits % 3) + 1;
  navigator.vibrate?.(120);
  if (state.entrenamientoHits === 3) {
    toast('¡Entrenamiento completado! 3 de 3 aciertos seguidos.', 'ok');
  }
  render();
}


window.VISTAS = {
  rutas: viewEstudianteRutas,
  sos: viewEstudianteSOS,
  reportar: viewEstudianteReportar,
  red: viewEstudianteRed,
  historial: viewEstudianteHistorial,
  config: viewEstudianteConfig
};
iniciarPanel('estudiante');
