const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 3000;
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())

// routes
import userRouter from "./routes/userRoutes.ts";
import productRouter from "./routes/productRoutes.ts";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
