import express from 'express';
import path from 'path';
import ejs from 'ejs';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    res.render('pages/home', { pageTitle: 'Home'});
});

app.get('/contacto', async (req, res) => {
    res.render('pages/contacto', {pageTitle: 'Contacto'})
})

app.get('/nosotros', async (req, res) => {
    res.render('pages/nosotros', {pageTitle: 'Nosotros'})
})

app.get('/productos', async (req, res) => {
    res.render('pages/productos', {pageTitle: 'Productos'})
})

app.get('/producto/:categoria', async (req, res) => {
    const {categoria} = req.params;
    try {
        const response = await fetch(`http://localhost:3000/productos/${encodeURIComponent(categoria)}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        res.render('pages/producto', { pageTitle: 'Listado', data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/login', async (req, res) => {
    res.render('pages/auth/login', {pageTitle: 'Iniciar sesion', error: null})
})

app.get('/registro', async (req, res) => {
    res.render('pages/auth/register', {pageTitle: 'Registrarse', error: null})
})

app.get('/logout', async (req, res) => {
    res.send(`
        <script>
            localStorage.clear();
            window.location.href = '/';
        </script>
        `)
})

app.get('/perfil', async (req, res) => {
    res.render('pages/perfil', {pageTitle: 'Perfil'});
})

app.get('/carrito', async (req, res) => {
    res.render('pages/carrito', {pageTitle: 'Carrito'})
})

const PORT = 4000;

app.listen(PORT, () => console.log(`Servidor de frontend iniciado en http://localhost:${PORT}`));