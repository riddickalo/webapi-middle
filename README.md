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
psql -U <superuser> -f "./psql_script.txt"
# you may need the su password then
```
**Build environment**
```sh
npm install --prodcution
```
**Fetch front-end project**
```sh  
npm run clone-pages         # for linux-like os
npm run clone-pages-win     # for win os
```
**Start service**
```sh
npm run start
```

## Start using WarRoom~
[Open pages on browser (default on port 5001)](http://localhost:5001)  
The api documentation that follows OpenAPI v3.0 specification serves on
[/api-docs](http://localhost:5001/api-docs)