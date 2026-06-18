const Users = require('./users.model');
const Articles = require('./article.model');
const Reports = require('./reports.model');

// Ordenar por fecha
const sortByDate = (arr) =>
  arr.sort((a, b) => new Date(b.date) - new Date(a.date));

// ACTIVIDAD DIARIA
const getDailyActivity = async () => {
  const users = await Users.selectDailyUsers();
  const articles = await Articles.selectDaily();
  const sold = await Articles.selectDailySold();
  const reports = await Reports.getDailyReports();

  const mapped = [
    ...users.map(u => ({
      type: 'usuario',
      description: `Nuevo usuario registrado`,
      user: u.usuario,
      date: u.fecha
    })),

    ...articles.map(a => ({
      type: 'articulo',
      description: `Nuevo artículo publicado: "${a.titulo}"`,
      user: `${a.nombre} ${a.apellidos}`,
      date: a.fecha
    })),

    ...sold.map(s => ({
      type: 'venta',
      description: `Artículo vendido: "${s.titulo}"`,
      user: `${s.nombre} ${s.apellidos}`,
      date: s.fecha
    })),

    ...reports.map(r => ({
      type: 'reporte',
      description: `Artículo reportado: "${r.articulo_reportado}" (${r.motivo})`,
      user: r.usuario,
      date: r.date
    }))
  ];

  return sortByDate(mapped);
};

// ACTIVIDAD SEMANAL
const getWeeklyActivity = async () => {
  const users = await Users.selectWeeklyUsers();
  const articles = await Articles.selectWeekly();
  const sold = await Articles.selectWeeklySold();
  const reports = await Reports.getWeeklyReports();

  const mapped = [
    ...users.map(u => ({
      type: 'usuario',
      description: `Nuevo usuario registrado`,
      user: u.usuario,
      date: u.fecha
    })),

    ...articles.map(a => ({
      type: 'articulo',
      description: `Nuevo artículo publicado: "${a.titulo}"`,
      user: `${a.nombre} ${a.apellidos}`,
      date: a.fecha
    })),

    ...sold.map(s => ({
      type: 'venta',
      description: `Artículo vendido: "${s.titulo}"`,
      user: `${s.nombre} ${s.apellidos}`,
      date: s.fecha
    })),

    ...reports.map(r => ({
      type: 'reporte',
      description: `Artículo reportado: "${r.articulo_reportado}" (${r.motivo})`,
      user: r.usuario,
      date: r.date
    }))
  ];

  return sortByDate(mapped);
};

// ACTIVIDAD MENSUAL
const getMonthlyActivity = async () => {
  const users = await Users.selectMonthlyUsers();
  const articles = await Articles.selectMonthly();
  const sold = await Articles.selectMonthlySold();
  const reports = await Reports.getMonthlyReports();

  const mapped = [
    ...users.map(u => ({
      type: 'usuario',
      description: `Nuevo usuario registrado`,
      user: u.usuario,
      date: u.fecha
    })),

    ...articles.map(a => ({
      type: 'articulo',
      description: `Nuevo artículo publicado: "${a.titulo}"`,
      user: `${a.nombre} ${a.apellidos}`,
      date: a.fecha
    })),

    ...sold.map(s => ({
      type: 'venta',
      description: `Artículo vendido: "${s.titulo}"`,
      user: `${s.nombre} ${s.apellidos}`,
      date: s.fecha
    })),

    ...reports.map(r => ({
      type: 'reporte',
      description: `Artículo reportado: "${r.articulo_reportado}" (${r.motivo})`,
      user: r.usuario,
      date: r.date
    }))
  ];

  return sortByDate(mapped);
};

module.exports = { getDailyActivity, getMonthlyActivity, getWeeklyActivity };
