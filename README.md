### TODO:
1. financial budget display and manipulation if admin
2. dirs like UI with yearly proj tracks each dir  

#### dev setup:

```bash
npm install && npm audit fix && npm start
```


{
  "verbose": true,
  "ignore": [
    "frontend/public/",
    "frontend/dist/",
    "backend/dist/"
  ],
  "ext": "ts,ejs",
  "exec": "NODE_ENV=development TS_NODE_PROJECT=backend/configs/tsconfig.json node ts-node backend/src/app.ts"
}
