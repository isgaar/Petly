const pool = require('../db');

// Módulo para validar CURP
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

  // Validación de letras del nombre/apellidos
  if (!(curp[0] === apellido1[0] &&
        curp[1] && apellido1.includes(curp[1]) &&
        curp[2] && apellido2.includes(curp[2]) &&
        curp[3] && nombre.includes(curp[3]))) {
    return { valido: false, razon: 'La CURP no coincide con el nombre y apellidos' };
  }

  // Fecha de nacimiento
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

// Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, primerApellido, segundoApellido, curp, correo, contrasena } = req.body;

    // Validación básica
    if (!nombre || !primerApellido || !curp || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    // Validar CURP contra nombre y estructura
    const curpValidada = validarCurp(curp, nombre, primerApellido, segundoApellido);
    if (!curpValidada.valido) {
      return res.status(400).json({ mensaje: 'CURP incorrecta' });
    }

    // Verificar si ya existe un usuario con ese correo o curp
    const usuarioExistente = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1 OR curp = $2',
      [correo, curp]
    );
    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo o CURP' });
    }

    // Insertar el nuevo usuario
    await pool.query(
  `INSERT INTO usuarios (
    nombre, primer_apellido, segundo_apellido,
    curp, correo, contrasena,
    fecha_nacimiento, sexo, estado_nacimiento
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
  [
    nombre,
    primerApellido,
    segundoApellido,
    curp,
    correo,
    contrasena,
    curpValidada.fechaNacimiento,
    curpValidada.sexo,
    curpValidada.estadoNacimiento
  ]
);


    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      datosCurp: {
        fechaNacimiento: curpValidada.fechaNacimiento,
        sexo: curpValidada.sexo,
        estadoNacimiento: curpValidada.estadoNacimiento
      }
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  registrarUsuario
};
