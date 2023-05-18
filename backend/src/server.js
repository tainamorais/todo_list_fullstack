const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.MYSQLPORT || 3333;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
