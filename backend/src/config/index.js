const app = require('./app');
const database = require('./database');

const main = () => {
    database.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return;
        }
        console.log('Base de datos conectada');
        
        app.listen(3000, () => {
            console.log('Servidor escuchando en el puerto 3000');
        });
    });
};

main();
