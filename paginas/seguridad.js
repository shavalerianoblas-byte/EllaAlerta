/* EllaAlerta — funciones del rol "seguridad" (se conecta con paginas/seguridad.html) */
function viewSeguridadMapa() {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-4 bg-white text-cobalto p-6 rounded-3xl shadow-2xl space-y-4">
        <h2 class="t-subtitulo">Filtrar Zonas Críticas</h2>
        <div>
          <label class="block text-xs font-bold text-acento4 mb-1">Rango de fechas</label>
          <select class="w-full px-4 py-3 rounded-xl bg-lavanda text-sm font-semibold">
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
            <option>Ciclo Académico Actual</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-acento4 mb-1">Franja horaria</label>
          <div class="grid grid-cols-3 gap-2">
            ${['Mañana', 'Tarde', 'Noche'].map(f => `
              <button onclick="state.segFiltroFranja='${f}'; render();"
                      class="py-2 rounded-xl text-xs font-bold ${state.segFiltroFranja === f ? 'bg-cobalto text-white' : 'bg-lavanda text-cobalto'}">
                ${f}
              </button>
            `).join('')}
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-acento4 mb-1">Tipo de incidente</label>
          <div class="grid grid-cols-2 gap-2">
            ${['Todos', 'Acoso', 'Robo', 'Poca luz'].map(t => `
              <button onclick="state.segFiltroTipo='${t}'; render();"
                      class="py-2 rounded-xl text-xs font-bold ${state.segFiltroTipo === t ? 'bg-cobalto text-white' : 'bg-lavanda text-cobalto'}">
                ${t}
              </button>
            `).join('')}
          </div>
        </div>
        <button onclick="toast('Filtros aplicados al mapa perimetral.')" class="w-full py-3 rounded-2xl bg-acento1 text-cobalto font-bold text-sm">
          Aplicar filtros al mapa
        </button>
      </div>

      <div class="lg:col-span-8 space-y-4">
        ${renderMapaSVG('iluminada', true)}
      </div>
    </div>
  `;
}

function viewSeguridadAnalitica() {
  const reportes = DB.get('reportes').slice().reverse();

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="t-titulo">Analítica y Exportación</h1>
          <p class="t-pequeno text-acento1">Identidad protegida · Reportes comunitarios anonimizados para Comisaría y Serenazgo.</p>
        </div>
        <button onclick="window.print()" class="no-print px-5 py-3 rounded-2xl bg-acento1 hover:bg-white text-cobalto font-bold text-sm flex items-center gap-2 shadow-lg self-start">
          ${icon('download')} Exportar reporte en PDF
        </button>
      </div>

      <div class="bg-white text-cobalto rounded-3xl overflow-hidden shadow-2xl card-print">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-lavanda text-cobalto text-xs uppercase">
                <th class="p-4">Fecha</th>
                <th class="p-4">Tipo de incidente</th>
                <th class="p-4">Ubicación</th>
                <th class="p-4">Detalle</th>
                <th class="p-4">Reportante</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-lavanda text-sm">
              ${reportes.map(r => `
                <tr>
                  <td class="p-4 whitespace-nowrap text-xs text-acento4">${formatFecha(r.fecha)}</td>
                  <td class="p-4 font-bold">${esc(r.tipo)}</td>
                  <td class="p-4">${esc(r.ubic)}</td>
                  <td class="p-4 text-xs text-acento4">${esc(r.det || '—')}</td>
                  <td class="p-4"><span class="px-2.5 py-1 rounded-full bg-lavanda text-xs font-bold">Anónimo</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}


window.VISTAS = {
  mapa_seg: viewSeguridadMapa,
  analitica: viewSeguridadAnalitica
};
iniciarPanel('seguridad');
