const app = require('./app')

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log('app is listening on port 9090.'));