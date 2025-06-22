require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Настройка CORS
const allowedOrigins = ['http://localhost:5000', 'http://127.0.0.1:5500', 'http://localhost:5500'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Подключение SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: console.log
});

// Модель администратора
const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

// Middleware для проверки JWT
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const admin = await Admin.findByPk(decoded.id);
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


async function initDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Аккуратно обновляет схему
    
    const adminExists = await Admin.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPass = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', password: hashedPass });
      console.log('Test admin created: admin/admin123');
    }
  } catch (err) {
    console.error('Database error:', err);
    process.exit(1); // Завершить при неудаче
  }
}

// API Endpoints
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const admin = await Admin.findOne({ where: { username } });
    
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id }, 
      process.env.JWT_SECRET || 'secret123', 
      { expiresIn: '1h' }
    );

    res.cookie('adminToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return res.json({ 
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  return res.json({ message: 'Logged out successfully' });
});

app.get('/api/admin/dashboard', protect, (req, res) => {
  return res.json({
    message: `Welcome ${req.admin.username}`,
    stats: {
      users: 150,
      products: 45,
      orders: 32
    }
  });
});

// Добавьте этот middleware перед статическими файлами
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api-maps.yandex.ru https://yastatic.net; " +
    "style-src 'self' 'unsafe-inline' https://yastatic.net; " +
    "img-src 'self' data: https://*.maps.yandex.net https://yastatic.net; " +
    "connect-src 'self' https://*.maps.yandex.net https://yastatic.net; " +
    "frame-src https://*.yandex.ru;"
  );
  next();
});

// Обслуживание статических файлов
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/cart', express.static(path.join(__dirname, 'cart')));
app.use('/category', express.static(path.join(__dirname, 'category')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/main', express.static(path.join(__dirname, 'main')));
app.use('/menu', express.static(path.join(__dirname, 'menu')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/order', express.static(path.join(__dirname, 'order')));
app.use('/orders', express.static(path.join(__dirname, 'orders')));
app.use('/person', express.static(path.join(__dirname, 'person')));




// HTML Routes - исправленные пути
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'cart', 'index.html'));
});

app.get('/category', protect, (req, res) => {
  res.sendFile(path.join(__dirname, 'category', 'index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main', 'index.html'));
});

app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'menu', 'index.html'));
});

app.get('/order', protect, (req, res) => {
  res.sendFile(path.join(__dirname, 'order', 'index.html'));
});

app.get('/orders', protect, (req, res) => {
  res.sendFile(path.join(__dirname, 'orders', 'index.html'));
});

app.get('/person', protect, (req, res) => {
  res.sendFile(path.join(__dirname, 'person', 'index.html'));
});


// Обработка 404 для API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; img-src 'self' data: https://yastatic.net; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  next();
});