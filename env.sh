export RUN_ENV=''             # 'local' no scheduler, 'test' get device-events from .json, 'initialize' means sync all events from FOCAS, null means normal
export PORT=8082
export FOCAS_SYNC_MODE='active'    # data retriving mode, 'passive' means webhook
export FOCAS_URL='http://127.0.0.1:8083/api/device-events'
export FOCAS_SYNC_PERIOD=60
export UTILIZE_POLL_INTERVAL=1     # mins
export UTILIZE_DATE_RANGE=1       # days
export DB_HOST='localhost'
export DB_PORT=5432
export DB_DATABASE='webapi'
export DB_USERNAME='agent'
export DB_PASSWORD='1'
export DB_VERBOSE='f'