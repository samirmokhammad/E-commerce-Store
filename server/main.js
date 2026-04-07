const app = require('./app');

const PORT = process.env.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
