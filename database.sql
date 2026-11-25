-- Esquema MySQL equivalente a lo que app.js guarda hoy en localStorage
CREATE TABLE usuarios(
  id VARCHAR(20) PRIMARY KEY, nombre VARCHAR(100) NOT NULL, correo VARCHAR(120) UNIQUE NOT NULL,
  clave VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('estudiante','apoyo','seguridad','admin')),
  activo BOOLEAN DEFAULT TRUE, creado DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE red_confianza(
  id VARCHAR(20) PRIMARY KEY, usuario_id VARCHAR(20) NOT NULL REFERENCES usuarios(id),
  nombre VARCHAR(100), relacion VARCHAR(20), contacto VARCHAR(120), celular VARCHAR(20), estado VARCHAR(15));
CREATE TABLE trayectos(
  id VARCHAR(20) PRIMARY KEY, usuario_id VARCHAR(20) REFERENCES usuarios(id),
  destino VARCHAR(150), ruta VARCHAR(15), estado VARCHAR(15), inicio DATETIME);
CREATE TABLE alertas(
  id VARCHAR(20) PRIMARY KEY, usuario_id VARCHAR(20) REFERENCES usuarios(id),
  tipo VARCHAR(20), ubicacion VARCHAR(150), estado VARCHAR(15), fecha DATETIME);
CREATE TABLE respuestas_alerta(
  id VARCHAR(20) PRIMARY KEY, alerta_id VARCHAR(20) REFERENCES alertas(id),
  nombre VARCHAR(100), respuesta VARCHAR(40));
CREATE TABLE reportes(
  id VARCHAR(20) PRIMARY KEY, usuario_id VARCHAR(20) REFERENCES usuarios(id), anonimo BOOLEAN,
  tipo VARCHAR(40), ubicacion VARCHAR(150), detalle VARCHAR(500), estado VARCHAR(15), fecha DATETIME);
CREATE TABLE comentarios(
  id VARCHAR(20) PRIMARY KEY, usuario_id VARCHAR(20) REFERENCES usuarios(id),
  mensaje VARCHAR(500), estado VARCHAR(15), fecha DATETIME);
