// // #!/usr/bin/env node
// import { middle_app } from "../app.mjs";
// import { createServer } from "http";
// import orm_agent from "../models/orm_agent.mjs";
// import Alarm from '../models/alarm.mjs';
// import Nc_Info from "../models/nc_info.mjs";
// import Prod_Record from '../models/prod_record.mjs';


// (async () => {
//     const server = createServer(middle_app);
//     await orm_agent.sync({ alter: true, force: false })
//                     .then(() => console.info('ORM model sync'))
//                     .catch(({original, }) => console.error(original))
// })();