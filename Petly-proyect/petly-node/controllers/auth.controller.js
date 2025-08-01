// controllers/auth.controller.js
const pool = require('../db');
const { enviarCodigoVerificacion } = require('../emailService');

// ========== UTILIDAD: Validación de CURP ==========
function validarCurp(curp, nombre, apellido1, apellido2) {
  const estadosCurp = {
    'AS': 'Aguascalientes', 'BC': 'Baja California', 'BS': 'Baja California Sur',
    'CC': 'Campeche', 'CL': 'Coahuila', 'CM': 'Colima', 'CS': 'Chiapas',
    'CH': 'Chihuahua', 'DF': 'Ciudad de México', 'DG': 'Durango', 'GT': 'Guanajuato',
    'GR': 'Guerrero', 'HG': 'Hidalgo', 'JC': 'Jalisco', 'MC': 'México',
    'MN': 'Michoacán', 'MS': 'Morelos', 'NT': 'Nayarit', 'NL': 'Nuevo León',
    'OC': 'Oaxaca', 'PL': 'Puebla', 'QT': 'Querétaro', 'QR': 'Quintana Roo',
    'SP': 'San Luis Potosí', 'SL': 'Sinaloa', 'SR': 'Sonora', 'TC': 'Tabasco',
    'TS': 'Tamaulipas', 'TL': 'Tlaxcala', 'VZ': 'Veracruz', 'YN': 'Yucatán',
    'ZS': 'Zacatecas', 'NE': 'Nacido en el extranjero'
  };

  curp = curp.trim().toUpperCase();
  nombre = nombre.trim().toUpperCase();
  apellido1 = apellido1.trim().toUpperCase();
  apellido2 = apellido2.trim().toUpperCase();

  if (curp.length !== 18) return { valido: false, razon: 'Longitud incorrecta' };

  if (!(curp[0] === apellido1[0] &&
        apellido1.includes(curp[1]) &&
        apellido2.includes(curp[2]) &&
        nombre.includes(curp[3]))) {
    return { valido: false, razon: 'La CURP no coincide con el nombre y apellidos' };
  }

  try {
    const anio = parseInt(curp.slice(4, 6));
    const mes = parseInt(curp.slice(6, 8));
    const dia = parseInt(curp.slice(8, 10));
    const siglo = curp[16] >= '0' && curp[16] <= '5' ? 1900 : 2000;
    const nacimiento = new Date(siglo + anio, mes - 1, dia);

    const hoy = new Date();
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const sexo = curp[10] === 'H' ? 'Hombre' : curp[10] === 'M' ? 'Mujer' : 'Desconocido';
    const estado = estadosCurp[curp.slice(11, 13)] || 'Estado desconocido';

    return {
      valido: true,
      fechaNacimiento: nacimiento.toISOString().split('T')[0],
      edad,
      sexo,
      estadoNacimiento: estado
    };
  } catch {
    return { valido: false, razon: 'Fecha inválida en la CURP' };
  }
}

// ========== REGISTRO ==========
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, primerApellido, segundoApellido, curp, correo, contrasena } = req.body;
    if (!nombre || !primerApellido || !curp || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const curpValidada = validarCurp(curp, nombre, primerApellido, segundoApellido);
    if (!curpValidada.valido) {
      return res.status(400).json({ mensaje: 'CURP incorrecta' });
    }

    const usuarioExistente = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1 OR curp = $2',
      [correo, curp]
    );
    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo o CURP' });
    }

    await pool.query(
      `INSERT INTO usuarios (
        nombre, primer_apellido, segundo_apellido,
        curp, correo, contrasena,
        fecha_nacimiento, sexo, estado_nacimiento
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        nombre, primerApellido, segundoApellido, curp,
        correo, contrasena,
        curpValidada.fechaNacimiento,
        curpValidada.sexo,
        curpValidada.estadoNacimiento
      ]
    );

    const codigo = Math.floor(100000 + Math.random() * 900000);
    await pool.query(
      'INSERT INTO codigos_verificacion (correo, codigo) VALUES ($1, $2)',
      [correo, codigo.toString()]
    );

    await enviarCodigoVerificacion(correo, codigo);

    res.status(201).json({ mensaje: 'Usuario registrado. Verifica tu correo electrónico.' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// ========== LOGIN ==========
const iniciarSesion = async (req, res) => {
  try {
    const { identificador, contrasena } = req.body;
    if (!identificador || !contrasena) {
      return res.status(400).json({ mensaje: 'Faltan datos para iniciar sesión' });
    }

    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1 OR curp = $1',
      [identificador]
    );
    const usuario = resultado.rows[0];

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    if (usuario.contrasena !== contrasena) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// ========== VERIFICAR CÓDIGO ==========
const verificarCodigo = async (req, res) => {
  try {
    const { correo, codigo } = req.body;
    if (!correo || !codigo) {
      return res.status(400).json({ mensaje: 'Correo y código son requeridos' });
    }

    const resultado = await pool.query(
      'SELECT * FROM codigos_verificacion WHERE correo = $1 AND codigo = $2',
      [correo, codigo]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Código incorrecto o ya verificado' });
    }

    await pool.query('DELETE FROM codigos_verificacion WHERE correo = $1 AND codigo = $2', [correo, codigo]);

    res.status(200).json({ mensaje: 'Correo verificado correctamente' });
  } catch (error) {
    console.error('Error al verificar código:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// ========== REENVIAR CÓDIGO ==========
const reenviarCodigo = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ mensaje: 'Correo requerido' });

    const usuario = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No existe un usuario con ese correo' });
    }

    await pool.query('DELETE FROM codigos_verificacion WHERE correo = $1', [correo]);

    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query('INSERT INTO codigos_verificacion (correo, codigo) VALUES ($1, $2)', [correo, nuevoCodigo]);

    await enviarCodigoVerificacion(correo, nuevoCodigo);

    res.status(200).json({ mensaje: 'Nuevo código enviado al correo' });
  } catch (error) {
    console.error('Error al reenviar código:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// ========== EXPORT ==========
module.exports = {
  registrarUsuario,
  iniciarSesion,
  verificarCodigo,
  reenviarCodigo
};