import orm_agent from "./orm_agent.mjs";
import Alarm from "./alarm.mjs";
import Nc_Info from "./nc_info.mjs";
import Prod_Record from "./prod_record.mjs";
import User from "./user.mjs";
import Setting from "./setting.mjs";

(async () => await orm_agent.sync({ alter: true, force: false })
                    .then(() => console.info('ORM model sync'))
                    .catch(({original, }) => console.error(original)))();