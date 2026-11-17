-- Kroni · Esquema de la base de datos (PostgreSQL)

-- ===== Localización =====
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(3) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  country_id INT NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  name VARCHAR(100) NOT NULL,
  UNIQUE (country_id, name)
);

CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  department_id INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  name VARCHAR(100) NOT NULL,
  UNIQUE (department_id, name)
);

-- ===== Auth =====
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('client','admin','agent')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===== Administradores (catálogo y reportes) =====
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_min INT NOT NULL DEFAULT 60,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('reservations','revenue','users')),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (date_from <= date_to)
);

-- ===== Clientes (reservas) =====
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  agent_id INT REFERENCES users(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INT NOT NULL DEFAULT 1 CHECK (guests > 0),
  notes TEXT NOT NULL DEFAULT '',
  status VARCHAR(12) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===== Agentes (eventos) =====
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  city_id INT REFERENCES cities(id) ON DELETE SET NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  capacity INT NOT NULL DEFAULT 50 CHECK (capacity > 0),
  status VARCHAR(12) NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','completed','cancelled')),
  agent_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_res_user ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_res_agent ON reservations(agent_id);
CREATE INDEX IF NOT EXISTS idx_res_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_events_agent ON events(agent_id);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city_id);
