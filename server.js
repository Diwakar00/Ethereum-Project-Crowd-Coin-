const { createServer } = require("http");
const next = require("next");

const app = next({
  dev: process.env.NODE_ENV !== "production",
});

const routes = require("./routes");
const handlers = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer(handlers).listen(5000, (err) => {
    if (err) throw err;
    console.log("ready in http://localhost:5000");
  });
});
