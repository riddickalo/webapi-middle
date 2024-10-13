import express from "express";
import { getVersion, getSettingParams, setSettingParams } from "../controllers/sysInfo.mjs";
import { getStatus, setNcAttr, getAlarm } from "../controllers/getStatus.mjs";
import { deviceEventsHook } from "../controllers/eventHook.mjs";
import { getMaintainData, updateMaintainData, deleteMaintainItem } from "../controllers/maintain.mjs";
import { testNotify } from "../controllers/testNotify.mjs";

const router = express.Router();

router.all('/', getVersion);
router.get('/status', getStatus);               // 取得機台資料
router.post('/status', setNcAttr);              // 設定機台資料
router.get('/alarm/:type', getAlarm);           // 取得警報資料 
router.get('/sys', getSettingParams);           // 取得系統參數
router.post('/sys', setSettingParams);          // 設定系統參數
router.get('/maintain/:ncId', getMaintainData); // 取得保養項目資料
router.post('/maintain/:behavior', updateMaintainData);     // 更新保養項目
router.delete('/maintain/:itemSN', deleteMaintainItem);     // 刪除保養項目
router.all('/test-notify/:type', testNotify);   // 測試通知功能

router.post('/events-hook', deviceEventsHook);  // FOCAS更新資料 web-hook

export default router;

/**
 * @swagger
 * /api:
 *  get:
 *      summary: get middle server version
 *      responses:
 *          200:
 *              description: return ver.
 *              
 * /api/status:
 *  get:
 *      summary: retrieve all machine status
 *      responses:
 *          200:
 *              description: return all machine status in array
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items: 
 *                              type: object
 *                              properties:
 *                                  nc_id:
 *                                      type: string
 *                                      description: machine unique id
 *                                      example: 'NC-1-2'
 *                                  nc_ip:
 *                                      type: string
 *                                      descrition: ip address
 *                                  region:
 *                                      type: string
 *                                      description: machine attributes, located region
 *                                      example: 'Factory 1'
 *                                  prod_line:
 *                                      type: string
 *                                      description: machine attributes, production line
 *                                      example: 'Ball Screw-S1'
 *                                  station:
 *                                      type: string
 *                                      description: machine attributes, production station
 *                                      example: 'Surface Grinding'
 *                                  opStatus:
 *                                      type: string
 *                                      description: machine operating status.
 *                                      example: 'running'
 *                                  running_flag:
 *                                      type: integer
 *                                      description: correspond to machine running flag
 *                                      example: 1
 *                                  ncfile:
 *                                      type: string
 *                                      description: executing program name
 *                                      example: 'run_100.nc'
 *                                  maintainStatus:
 *                                      type: integer
 *                                      description: machine maintain status. 0 means inactive, 1 means scheduled, 2 maintain today, 3 means overtime.
 *                                  utilize_rate:
 *                                      type: integer
 *                                      description: machine periodic utilization rate
 *                                      example: 76
 *  post:
 *      summary: set new status for one machine
 *      description: send machine updated status in request body
 *      responses:
 *          200: 
 *              description: return new status
 *          404: 
 *              description: no machine found
 *          500: 
 *              description: error occured on updating status
 * /api/alarm:
 *  get:
 *      summary: get alarm data
 *      parameters:
 *          - name: type
 *            in: path
 *            type: string
 *            required: true
 *            description: choose 'current' for current alarms or 'history' for all alarm history
 *      responses:
 *          200:
 *              description: return alarms in array
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  alarm_sn:
 *                                      type: integer
 *                                      description: alarm data serial no.
 *                                      example: 124
 *                                  nc_id:
 *                                      type: string
 *                                      description: from which machine
 *                                      exmaple: 'NC-1-2'
 *                                  alarm_type:
 *                                      type: string
 *                                      description: type of alarm, if present
 *                                      exmaple: 'servo motor 1'
 *                                  alarm_msg: 
 *                                      type: string
 *                                      description: alarm msg, if present
 *                                      exmaple: 'torque overload'
 *                                  alarm_timestamp:
 *                                      type: string
 *                                      format: date-time
 *                                      description: alarm timestamp
 *                                  history_flag:
 *                                      type: boolean
 *                                      description: if true, means this alarm had been turned off
 *          400: 
 *              description: wrong alarm type
 * /api/sys:
 *  get:
 *      summary: get system setting
 *      responses:
 *          200:
 *              description: return setting
 *          404:
 *              description: no setting found
 *  post:
 *      summary: update system setting
 *      description: send new setting in request body
 *      responses:
 *          200:
 *              description: applied, return new setting
 *          404:
 *              description: no setting found
 * /api/maintain:
 *  get:
 *      summary: get maintain items and records
 *      responses: 
 *          200:
 *              description: return maintain items and records in array, it can be all data or for one machine
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              items:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          sn:
 *                                              type: integer
 *                                              description: maintain item identity no.
 *                                              example: 11
 *                                          nc_id:
 *                                              type: string
 *                                              description: which machine
 *                                              example: 'NC-700-E'
 *                                          item:
 *                                              type: string
 *                                              description: item title
 *                                              example: change oil
 *                                          period:
 *                                              type: integer
 *                                              description: maintainence period (day)
 *                                              example: 20
 *                                          enable:
 *                                              type: boolean
 *                                              description: the maintain item status
 *                                              example: true
 *                                          status:
 *                                              type: integer
 *                                              description: maintain status. 0 means disable, 1 means shceduled, 2 means due on, 3 means expired
 *                                              example: 1
 *                                          scheduled_check_time:
 *                                              type: string
 *                                              format: date-time
 *                                              description: next maintainence time
 *                                          last_check_time:
 *                                              type: string
 *                                              format: date-time
 *                                              description: last maintainence check timestamp
 *                              records:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          sn:
 *                                              type: integer
 *                                              description: maintain records identity no.
 *                                              example: 102
 *                                          item:
 *                                              type: string
 *                                              description: item title
 *                                              example: change oil
 *                                          nc_id:
 *                                              type: string
 *                                              description: which machine
 *                                              example: 'NC-700-E'
 *                                          status:
 *                                              type: integer
 *                                              description: maintain item status at the time when record was created
 *                                              example: 2
 *                                          worker:
 *                                              type: string
 *                                              description: the record was created by which account (according to login account)
 *                                              example: 'admin'
 *                                          scheduled_check_time:
 *                                              type: string
 *                                              description: the scheduled time to maintain
 *                                              format: date-time
 *                                          actual_check_time:
 *                                              type: string
 *                                              format: date-time
 *                                              description: the actual maintainence timestamp 
 *          400: 
 *              description: no maintain data found
 *          500: 
 *              description: other errors internally
 *  post:
 *      summary: update maitain data
 *      parameters:
 *          - name: behavior
 *            type: string
 *            in: path
 *            required: true
 *            description: set 'update-item' for updating maintain item, 'create-record' for creating a new maintain record
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          sn:
 *                              type: integer
 *                              description: maintain item identity no.
 *                              example: 11
 *                          nc_id:
 *                              type: string
 *                              description: which machine
 *                              example: 'NC-700-E'
 *                          item:
 *                              type: string
 *                              description: item title
 *                              example: change oil
 *                          period:
 *                              type: integer
 *                              description: maintainence period (day)
 *                              example: 20
 *                          enable:
 *                              type: boolean
 *                              description: the maintain item status
 *                              example: true
 *                          status:
 *                              type: integer
 *                              description: maintain status. 0 means disable, 1 means shceduled, 2 means due on, 3 means expired
 *                              example: 1
 *                          scheduled_check_time:
 *                              type: string
 *                              format: date-time
 *                              description: next maintainence time
 *                          last_check_time:
 *                              type: string
 *                              format: date-time
 *                              description: last maintainence check timestamp
 *      responses:
 *          200:
 *              description: return new maintain items and records
 *          500:
 *              description: server internal error 
 * delete:
 *      summary: delete maintain item
 *      parameters:
 *          - name: itemSN
 *            in: path
 *            type: integer
 *            description: the serial no. of maintain item
 *      responses:
 *          200:
 *              description: successfully deleted
 *          400: 
 *              description: bad itemSN in request
 * /api/test-notify:
 *  get:
 *      summary: test sending notify
 *      parameters:
 *          - name: type
 *            in: path
 *            required: true
 *            type: string
 *            description: set 'Email' for test e-mail or 'Line' for test line notify 
 *      responses:
 *          204: 
 *              description: test message sent
 *          400:
 *              description: wrong type
 *          500:
 *              description: server error
 *          
 * /api/events-hook:
 *  post:
 *      summary: handle device-events webhook
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              description: data serial no.
 *                              example: 123
 *                          deviceName:
 *                              type: string
 *                              description: identify machine, must be unique
 *                              example: 'NC-700-E'
 *                          hostname:
 *                              type: string
 *                              description: machine hosted ip address
 *                              example: '192.168.1.100'
 *                          port:
 *                              type: integer
 *                              description: connected port no.
 *                              example: 8193
 *                          exeProgName:
 *                              type: string
 *                              description: executing program name
 *                              example: 'TEST.NC'
 *                          running:
 *                              type: integer
 *                              description: machine running flag. 3 means running. 0 could be idle or under emergency, need to consider with other flags.
 *                              example: 3
 *                          emergency:
 *                              type: integer
 *                              descrition: emergency flag. 1 means emer-butt has been pressed.
 *                          alarm:
 *                              type: integer
 *                              description: alarm flag. 1 means alarm, 0 means normal
 *                          connected:
 *                              type: integer
 *                              description: connection flag
 *                              example: 1
 *                          errCode:
 *                              type: integer
 *                              description: error code if machine presented
 *                          timestamp: 
 *                              type: string
 *                              format: date-time
 *                  
 *      responses:
 *          204:
 *              description: handle incoming data successfully.
 *          400:
 *              description: wrong events format.
 *          500: 
 *              description: wrong running mode. middle server is not in passive mode.
 */