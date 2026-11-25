/* EllaAlerta — funciones del rol "apoyo" (se conecta con paginas/apoyo.html) */
function viewApoyoMonitoreo() {
  const usuarios = DB.get('usuarios');
  const misVinculos = DB.get('red').filter(r => r.contacto === state.user.correo);
  const lista = misVinculos.length > 0
    ? misVinculos.map(v => ({ rel: v.rel, u: usuarios.find(x => x.id === v.uid) })).filter(x => x.u)
    : [{ rel: 'Familiar', u: usuarios.find(x => x.id === 'usr_daniela') }].filter(x => x.u);

  const alertasActivas = DB.get('alertas').filter(a => a.estado === 'activa');

  return `
    <div class="space-y-6">
      ${alertasActivas.length > 0 ? `
        <div class="bg-alertaRojo text-white p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div class="flex items-center gap-3">
            ${icon('crisis_alert', 'text-3xl')}
            <div>
              <p class="font-bold text-base">¡ALERTA CRÍTICA ACTIVA! ${esc(alertasActivas[0].nombre)} necesita ayuda</p>
              <p class="text-xs opacity-90">${esc(alertasActivas[0].tipo)} · ${esc(alertasActivas[0].ubicacion || 'UPC San Miguel')}</p>
            </div>
          </div>
          <button onclick="setTab('crisis')" class="px-5 py-2.5 rounded-xl bg-white text-alertaRojo font-bold text-sm shrink-0">
            Ir a Sala de Crisis
          </button>
        </div>
      ` : ''}

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-5 space-y-4">
          <h1 class="t-titulo">Monitoreo Activo</h1>
          <p class="t-pequeno text-acento1">Personas que comparten su trayecto contigo en tiempo real.</p>

          ${lista.map(({ rel, u }) => {
            const tray = DB.get('trayectos').filter(t => t.uid === u.id).pop();
            return `
              <div class="bg-white text-cobalto p-5 rounded-3xl shadow-xl space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-lavanda font-bold text-lg flex items-center justify-center">
                      ${esc(u.nombre.charAt(0))}
                    </div>
                    <div>
                      <h3 class="font-bold text-base">${esc(u.nombre)} · ${tray?.estado === 'en trayecto' ? 'En trayecto' : 'En destino'}</h3>
                      <span class="text-xs text-seguroVerde font-bold flex items-center gap-1">
                        ${icon('battery_charging_full', 'text-sm')} ${tray?.bateria || 85}% de batería · ${esc(rel)}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 bg-lavanda p-3.5 rounded-2xl text-center">
                  <div>
                    <p class="text-[11px] text-acento4">Destino</p>
                    <p class="font-bold text-xs sm:text-sm truncate">${esc(tray?.destino || 'UPC San Miguel')}</p>
                  </div>
                  <div>
                    <p class="text-[11px] text-acento4">Llegada estimada (ETA)</p>
                    <p class="font-bold text-xs sm:text-sm">${esc(tray?.eta || '14 min')}</p>
                  </div>
                </div>

                <a href="tel:976543129" class="w-full py-3 rounded-2xl bg-cobalto text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-acento4 transition">
                  ${icon('call')} Llamar a ${esc(u.nombre.split(' ')[0])}
                </a>
              </div>
            `;
          }).join('')}
        </div>

        <div class="lg:col-span-7 space-y-4">
          ${renderMapaSVG('iluminada', false)}
          <div class="bg-white text-cobalto p-5 rounded-2xl shadow space-y-2.5">
            <h3 class="font-bold text-sm uppercase text-acento4">Historial de avisos automáticos</h3>
            <div class="flex items-center justify-between text-xs p-2.5 rounded-xl bg-lavanda/60">
              <span class="font-semibold">● Salió de Campus UPC San Miguel</span>
              <span class="text-acento4">Hace 8 min</span>
            </div>
            <div class="flex items-center justify-between text-xs p-2.5 rounded-xl bg-lavanda/60">
              <span class="font-semibold">● Ruta iluminada verificada (Av. La Marina)</span>
              <span class="text-acento4">Hace 3 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function viewApoyoCrisis() {
  const alertas = DB.get('alertas').filter(a => a.estado === 'activa').slice().reverse();

  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 class="t-titulo">Sala de Crisis y Coordinación</h1>
        <p class="t-pequeno text-acento1">Respuesta colaborativa en tiempo real entre familiares y Seguridad UPC.</p>
      </div>

      ${alertas.length === 0 ? `
        <div class="bg-white text-cobalto p-8 rounded-3xl text-center space-y-3 shadow-xl">
          <div class="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-seguroVerde flex items-center justify-center">
            ${icon('verified', 'text-3xl')}
          </div>
          <h2 class="font-bold text-xl">No hay alertas activas en este momento</h2>
          <p class="text-sm text-acento4">Todas tus personas vinculadas se encuentran seguras.</p>
          <button onclick="setTab('monitoreo')" class="px-6 py-3 rounded-2xl bg-cobalto text-white font-bold text-sm">
            Volver al monitoreo
          </button>
        </div>
      ` : alertas.map(a => `
        <div class="bg-white text-cobalto rounded-3xl overflow-hidden shadow-2xl border-2 border-alertaRojo">
          <div class="bg-alertaRojo text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase mb-1">
                Alerta Crítica · Peligro Inminente
              </span>
              <h2 class="text-2xl font-bold">${esc(a.nombre)} necesita ayuda</h2>
              <p class="text-xs opacity-90 mt-1">Tipo: <b>${esc(a.tipo)}</b> · ${formatFecha(a.fecha)}</p>
            </div>
            <a href="tel:105" class="px-5 py-3 rounded-2xl bg-white text-alertaRojo font-bold text-sm flex items-center justify-center gap-2 shadow">
              ${icon('call')} Llamar 105 Policía
            </a>
          </div>

          <div class="p-6 space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-lavanda p-4 rounded-2xl text-xs">
              <div>
                <span class="text-acento4 block">Ubicación exacta</span>
                <b class="text-cobalto">${esc(a.ubicacion || 'Av. La Marina · UPC San Miguel')}</b>
              </div>
              <div>
                <span class="text-acento4 block">Coordenadas GPS</span>
                <b class="text-cobalto">-12.0765, -77.0935</b>
              </div>
              <div>
                <span class="text-acento4 block">Batería dispositivo</span>
                <b class="text-seguroVerde">82% (Transmisión continua)</b>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onclick="responderAlerta('${a.id}', 'Voy en camino')"
                      class="py-3.5 px-4 rounded-2xl bg-cobalto hover:bg-acento4 text-white font-bold text-sm flex items-center justify-center gap-2">
                ${icon('directions_run')} Voy en camino
              </button>
              <button onclick="responderAlerta('${a.id}', 'Llamando a Serenazgo')"
                      class="py-3.5 px-4 rounded-2xl bg-lavanda hover:bg-acento1 text-cobalto font-bold text-sm flex items-center justify-center gap-2">
                ${icon('local_police')} Llamar Serenazgo
              </button>
              <button onclick="responderAlerta('${a.id}', 'No puedo acudir ahora')"
                      class="py-3.5 px-4 rounded-2xl border border-acento1 text-acento4 font-bold text-sm">
                No puedo ayudar
              </button>
            </div>

            <div class="border-t border-lavanda pt-4">
              <h3 class="text-xs font-bold uppercase text-acento4 mb-2.5">Respuesta de la red de apoyo</h3>
              <div class="space-y-2">
                ${(a.resp || []).length === 0 ? '<p class="text-xs text-acento4">Aún nadie ha confirmado asistencia.</p>' : (a.resp || []).map(r => `
                  <div class="flex items-center justify-between p-3 rounded-xl bg-lavanda/60 text-xs">
                    <span class="font-bold">${esc(r.nombre)}</span>
                    <span class="px-2.5 py-1 rounded-full bg-white text-cobalto font-bold">${esc(r.r)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function responderAlerta(alertaId, respuestaTexto) {
  const al = DB.get('alertas').find(x => x.id === alertaId);
  if (!al) return;
  const otrasResp = (al.resp || []).filter(r => r.nombre !== state.user.nombre);
  DB.upd('alertas', alertaId, {
    resp: [...otrasResp, { nombre: state.user.nombre, r: respuestaTexto }]
  });
  toast(`Respuesta enviada: "${respuestaTexto}"`, 'ok');
  render();
}


window.VISTAS = {
  monitoreo: viewApoyoMonitoreo,
  crisis: viewApoyoCrisis
};
iniciarPanel('apoyo');
