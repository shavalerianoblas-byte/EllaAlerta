/* EllaAlerta — funciones del rol "admin" (se conecta con paginas/admin.html) */
function viewAdminUsuarios() {
  const allUsers = DB.get('usuarios');
  const filtered = allUsers.filter(u => {
    const matchText = (u.nombre + ' ' + u.correo).toLowerCase().includes(state.adminSearch.toLowerCase());
    const matchRole = state.adminRoleFilter === 'todos' || u.rol === state.adminRoleFilter;
    return matchText && matchRole;
  });

  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="inline-block px-3 py-1 rounded-full bg-acento1 text-cobalto text-xs font-bold mb-1">
            Intranet · Grupo Principal EllaAlerta
          </span>
          <h1 class="t-titulo">Gestión de Base de Datos (Usuarios)</h1>
          <p class="t-pequeno text-acento1">
            Administra registros y modifica el campo <code class="bg-acento4 px-1.5 py-0.5 rounded">rol VARCHAR(20)</code> en tiempo real.
          </p>
        </div>
        
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        ${Object.entries(ROLES).map(([key, label]) => `
          <div class="bg-white text-cobalto p-4 rounded-2xl shadow">
            <p class="text-xs text-acento4 font-semibold">${label}</p>
            <p class="text-2xl font-bold mt-1">${allUsers.filter(u => u.rol === key).length}</p>
          </div>
        `).join('')}
      </div>

      <div class="bg-lavanda text-cobalto p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <span class="absolute left-3.5 top-3 text-acento3">${icon('search', 'text-xl')}</span>
          <input type="text" value="${esc(state.adminSearch)}"
                 oninput="state.adminSearch = this.value; render();"
                 placeholder="Buscar por nombre o correo electrónico..."
                 class="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-acento1 text-sm focus:outline-none" />
        </div>
        <select onchange="state.adminRoleFilter = this.value; render();"
                class="px-4 py-2.5 rounded-xl bg-white border border-acento1 text-sm font-bold">
          <option value="todos" ${state.adminRoleFilter === 'todos' ? 'selected' : ''}>Todos los roles</option>
          ${Object.entries(ROLES).map(([k, v]) => `
            <option value="${k}" ${state.adminRoleFilter === k ? 'selected' : ''}>${v}</option>
          `).join('')}
        </select>
      </div>

      <div class="bg-white text-cobalto rounded-3xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-lavanda text-cobalto text-xs uppercase">
                <th class="p-4">Nombre</th>
                <th class="p-4">Correo</th>
                <th class="p-4">Rol (VARCHAR)</th>
                <th class="p-4">Estado Cuenta</th>
                <th class="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-lavanda text-sm">
              ${filtered.map(u => {
                const isSelf = u.id === state.user.id;
                return `
                  <tr class="hover:bg-lavanda/30 transition">
                    <td class="p-4 font-bold">${esc(u.nombre)} ${isSelf ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-cobalto text-white ml-1">Tú</span>' : ''}</td>
                    <td class="p-4 text-xs text-acento4">${esc(u.correo)}</td>
                    <td class="p-4">
                      <select ${isSelf ? 'disabled' : ''} onchange="adminChangeUserRole('${u.id}', this.value)"
                              class="px-3 py-2 rounded-xl bg-lavanda border border-acento1 text-xs font-bold text-cobalto">
                        ${Object.entries(ROLES).map(([rKey, rLabel]) => `
                          <option value="${rKey}" ${u.rol === rKey ? 'selected' : ''}>${rLabel}</option>
                        `).join('')}
                      </select>
                    </td>
                    <td class="p-4">
                      <button ${isSelf ? 'disabled' : ''} onclick="adminToggleUserActive('${u.id}')"
                              class="px-3 py-1.5 rounded-full text-xs font-bold transition ${u.activo ? 'bg-emerald-100 text-seguroVerde' : 'bg-amber-100 text-alertaAmbar'}">
                        ${u.activo ? '● Activa' : '● Pendiente aprobación'}
                      </button>
                    </td>
                    <td class="p-4 text-right">
                      ${!isSelf ? (state.confirmDeleteUserId === u.id ? `
                        <div class="inline-flex items-center gap-1.5">
                          <button onclick="adminDeleteUser('${u.id}')" class="px-2.5 py-1 rounded-lg bg-alertaRojo text-white text-xs font-bold">Confirmar</button>
                          <button onclick="state.confirmDeleteUserId=null; render();" class="px-2.5 py-1 rounded-lg bg-lavanda text-cobalto text-xs font-bold">Cancelar</button>
                        </div>
                      ` : `
                        <button onclick="state.confirmDeleteUserId='${u.id}'; render();" class="p-2 rounded-xl bg-red-50 text-alertaRojo hover:bg-alertaRojo hover:text-white transition" title="Eliminar registro">
                          ${icon('delete', 'text-lg')}
                        </button>
                      `) : '<span class="text-xs text-acento3">—</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function viewAdminBuzon() {
  const reportes = DB.get('reportes').slice().reverse();
  const comentarios = DB.get('comentarios').slice().reverse();
  const usuarios = DB.get('usuarios');

  return `
    <div class="space-y-8">
      <section class="space-y-3">
        <h2 class="t-subtitulo">Reportes Comunitarios Recibidos (${reportes.length})</h2>
        <div class="bg-white text-cobalto rounded-3xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-lavanda text-xs uppercase">
                  <th class="p-4">Fecha</th>
                  <th class="p-4">Tipo</th>
                  <th class="p-4">Ubicación</th>
                  <th class="p-4">Detalle</th>
                  <th class="p-4">Remitente</th>
                  <th class="p-4">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-lavanda text-sm">
                ${reportes.map(r => {
                  const autor = usuarios.find(u => u.id === r.uid);
                  return `
                    <tr>
                      <td class="p-4 text-xs text-acento4 whitespace-nowrap">${formatFecha(r.fecha)}</td>
                      <td class="p-4 font-bold">${esc(r.tipo)}</td>
                      <td class="p-4 text-xs">${esc(r.ubic)}</td>
                      <td class="p-4 text-xs text-acento4">${esc(r.det || '—')}</td>
                      <td class="p-4 text-xs font-semibold">${r.anon ? 'Anónimo' : esc(autor?.nombre || 'Usuario')}</td>
                      <td class="p-4">
                        <select onchange="adminUpdateItemStatus('reportes', '${r.id}', this.value)"
                                class="px-2.5 py-1.5 rounded-xl bg-lavanda text-xs font-bold">
                          ${['nuevo', 'leído', 'resuelto'].map(e => `<option value="${e}" ${r.estado === e ? 'selected' : ''}>${e}</option>`).join('')}
                        </select>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="t-subtitulo">Comentarios y Mensajes de Usuarios (${comentarios.length})</h2>
        <div class="bg-white text-cobalto rounded-3xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-lavanda text-xs uppercase">
                  <th class="p-4">Fecha</th>
                  <th class="p-4">Usuario / Rol</th>
                  <th class="p-4">Mensaje</th>
                  <th class="p-4">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-lavanda text-sm">
                ${comentarios.map(c => `
                  <tr>
                    <td class="p-4 text-xs text-acento4 whitespace-nowrap">${formatFecha(c.fecha)}</td>
                    <td class="p-4 font-bold text-xs">${esc(c.nombre)} <span class="text-acento3">(${ROLES[c.rol] || c.rol})</span></td>
                    <td class="p-4 text-sm">${esc(c.msg)}</td>
                    <td class="p-4">
                      <select onchange="adminUpdateItemStatus('comentarios', '${c.id}', this.value)"
                              class="px-2.5 py-1.5 rounded-xl bg-lavanda text-xs font-bold">
                        ${['nuevo', 'leído', 'resuelto'].map(e => `<option value="${e}" ${c.estado === e ? 'selected' : ''}>${e}</option>`).join('')}
                      </select>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  `;
}

function adminChangeUserRole(userId, newRole) {
  DB.upd('usuarios', userId, { rol: newRole });
  toast(`Rol actualizado a ${ROLES[newRole]} en la base de datos.`, 'ok');
  render();
}

function adminToggleUserActive(userId) {
  const u = DB.get('usuarios').find(x => x.id === userId);
  if (!u) return;
  DB.upd('usuarios', userId, { activo: !u.activo });
  toast(`Estado de cuenta actualizado para ${u.nombre}.`, 'ok');
  render();
}

function adminDeleteUser(userId) {
  DB.del('usuarios', userId);
  state.confirmDeleteUserId = null;
  toast('Registro eliminado de la tabla usuarios.');
  render();
}

function adminUpdateItemStatus(table, id, estado) {
  DB.upd(table, id, { estado });
  toast(`Estado actualizado a "${estado}".`, 'ok');
}


window.VISTAS = {
  intranet_usuarios: viewAdminUsuarios,
  intranet_buzon: viewAdminBuzon
};
iniciarPanel('admin');
