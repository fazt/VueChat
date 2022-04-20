import express from "express";
import morgan from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// middlewares
app.use(morgan("dev"));

app.get("/onlineusers", (req, res) => {
  console.log([...app.get("io").sockets.adapter.rooms.keys()]);
  res.send([...(app.get("io").sockets.adapter.rooms.keys())]);
});

// static files
app.use(express.static(join(__dirname, "public")));

export default app;
