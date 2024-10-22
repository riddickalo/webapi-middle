if [ $1 == '--start' ]; then
    npm run start && exit 0
elif [ $1 == '--stop' ]; then
    npm run stop && exit 0
elif [ $1 == '--status' ]; then
    npm run pm2-monitor && exit 0
fi