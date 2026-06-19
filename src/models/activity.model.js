const Users = require('./users.model');
const Articles = require('./article.model');
const Reports = require('./reports.model');

// Ordenar por fecha
const sortByDate = (arr) =>
  arr.sort((a, b) => new Date(b.date) - new Date(a.date));

const getActivityByRange = async (range) => {
  
  // 1. variables vacías para guardar los datos de la base de datos
  let users = [];
  let articles = [];
  let sold = [];
  let reports = [];

  // 2. Llenar las variables según el rango de la URL
  if (range === 'daily') {
    users = await Users.selectDailyUsers();
    articles = await Articles.selectDaily();
    sold = await Articles.selectDailySold();
    reports = await Reports.getDailyReports();
  } 
  else if (range === 'weekly') {
    users = await Users.selectWeeklyUsers();
    articles = await Articles.selectWeekly();
    sold = await Articles.selectWeeklySold();
    reports = await Reports.getWeeklyReports();
  } 
  else if (range === 'monthly') {
    users = await Users.selectMonthlyUsers();
    articles = await Articles.selectMonthly();
    sold = await Articles.selectMonthlySold();
    reports = await Reports.getMonthlyReports();
  } 
 
  // 3. transformar los datos
  const mapped = [
    ...users.map(u => ({
      type: 'usuario',
      description: 'Nuevo usuario registrado',
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
      date: r.fecha || r.date
    }))
  ];

  // 4. Devolvemos la lista ordenada
  return sortByDate(mapped);
};

module.exports = { getActivityByRange };