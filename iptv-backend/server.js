require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();


connectDB();


app.use(express.json());


app.post('/inline-test', (req, res) => {
  res.json({ ok: true });
});



app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.send('IPTV API running...');
});

app.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
 
  res.redirect(`iptv://reset-password/${token}`);
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on all interfaces');
});

