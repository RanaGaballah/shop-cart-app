import express from "express";

import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";

const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 5001;

import productRoutes from "./routes/productRoutes";
import CatrRoute from "./routes/cartRoutes";
import AuthRoute from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler);
app.use("/product", productRoutes);
app.use("/cart", CatrRoute);
app.use("/Auth", AuthRoute);
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
