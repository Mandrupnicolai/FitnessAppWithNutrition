import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectMongo } from "./db/mongoose.js";

await connectMongo(env.MONGODB_URI);

const app = createApp();
app.listen(env.API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.API_PORT}`);
});

