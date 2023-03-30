const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

console.log(app.get('env'));

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
