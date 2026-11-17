import bcrypt from 'bcryptjs';
import { pool } from './db';
import { buildReportData } from '../modules/administradores/services/report.service';

// Datos de ejemplo: solo se insertan si las tablas están vacías.
export async function seed(): Promise<void> {
  const c = await pool.query('SELECT COUNT(*)::int n FROM countries');
  if (c.rows[0].n === 0) {
    await pool.query(`INSERT INTO countries (name,code) VALUES ('Colombia','COL'),('México','MEX')`);
    await pool.query(`INSERT INTO departments (country_id,name)
      SELECT id, d FROM countries, unnest(ARRAY['Valle del Cauca','Cundinamarca','Antioquia']) d WHERE code='COL'`);
    await pool.query(`INSERT INTO departments (country_id,name)
      SELECT id, d FROM countries, unnest(ARRAY['Ciudad de México','Jalisco']) d WHERE code='MEX'`);
    await pool.query(`INSERT INTO cities (department_id,name) VALUES
      ((SELECT id FROM departments WHERE name='Valle del Cauca'),'Cali'),
      ((SELECT id FROM departments WHERE name='Valle del Cauca'),'Palmira'),
      ((SELECT id FROM departments WHERE name='Cundinamarca'),'Bogotá'),
      ((SELECT id FROM departments WHERE name='Antioquia'),'Medellín'),
      ((SELECT id FROM departments WHERE name='Ciudad de México'),'Ciudad de México'),
      ((SELECT id FROM departments WHERE name='Jalisco'),'Guadalajara')`);
    console.log('Localización de ejemplo creada');
  }

  const u = await pool.query('SELECT COUNT(*)::int n FROM users');
  if (u.rows[0].n > 0) return;
  const hash = (p: string) => bcrypt.hashSync(p, 10);
  await pool.query(
    `INSERT INTO users (name,email,password_hash,role) VALUES
     ('Administrador','admin@kroni.com',$1,'admin'),
     ('Laura Agente','agent@kroni.com',$2,'agent'),
     ('Carlos Cliente','client@kroni.com',$3,'client')`,
    [hash('admin123'), hash('agent123'), hash('client123')]);
  await pool.query(
    `INSERT INTO services (name,description,price,duration_min) VALUES
     ('Mesa para cenar','Reserva de mesa en el comedor principal.',0,120),
     ('Sala de reuniones','Sala equipada para hasta 10 personas.',45,60),
     ('Cancha de tenis','Cancha de arcilla con iluminación.',20,60),
     ('Masaje relajante','Sesión de masaje de cuerpo completo.',60,50)`);
  await pool.query(
    `INSERT INTO reservations (user_id,service_id,date,time,guests,notes,status)
     SELECT u.id, 1, CURRENT_DATE + 2, '20:00', 4, 'Cumpleaños', 'pending' FROM users u WHERE u.email='client@kroni.com'`);
  await pool.query(
    `INSERT INTO events (title,description,city_id,event_date,event_time,capacity,status,agent_id)
     SELECT 'Noche de degustación','Cena de maridaje con chef invitado.',
       (SELECT id FROM cities WHERE name='Cali'), CURRENT_DATE + 7, '19:00', 40, 'scheduled', u.id
     FROM users u WHERE u.email='agent@kroni.com'`);
  const from = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const to = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
  const data = await buildReportData('reservations', from, to);
  await pool.query(
    `INSERT INTO reports (title,type,date_from,date_to,notes,data,created_by)
     SELECT 'Reservas del mes','reservations',$1::date,$2::date,'Reporte de ejemplo',$3::jsonb,u.id FROM users u WHERE u.email='admin@kroni.com'`,
    [from, to, JSON.stringify(data)]);
  console.log('Datos de ejemplo creados');
}
