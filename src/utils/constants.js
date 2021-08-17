import constantsDev from './constants.dev.js';
import constantsProd from './constants.prod.js';

const constants = process.env.ENVIRONMENT == 'PROD' ? constantsProd : constantsDev;
export default constants;