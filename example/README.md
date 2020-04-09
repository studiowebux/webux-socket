## Webux-socket Example

Launch redis container

```bash
docker run -d --name redis -p 6379:6379 redis
```

Launch the frontend

```bash
cd frontend/
npm install
npm run serve
```

Launch the backend

```bash
npm install
node index.js
```
