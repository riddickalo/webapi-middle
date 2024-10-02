# JackTech WarRoom Middle Server
## Introduction
1. Retrieve device-events from FOCAS monitor
2. Process data
3. Serve api and views

## Dependencies
- Node.js v18.20
- PostgreSQL 15.8

## Installation
**Initialize database**  
```sh
psql -U <superuser> -d postgres -f "./psql_script.txt"
```
**Build environment**
```sh
npm install
```
**Fetch front-end project**
```sh  
npm run clone-pages         # for linux-like os
npm run clone-pages-win     # for win os
```
**Start server**
```sh
npm run start
```

## Enjoy the service~
[Open pages on browser (default on port 5001)](http://localhost:5001)