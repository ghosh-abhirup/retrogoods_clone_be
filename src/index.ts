const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser')
dotenv.config();

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cors({
  origin: `http://localhost:3000`,
  credentials: true
}));
app.use(cookieParser())

// routes
import userRouter from "./routes/userRoutes.ts";
import productRouter from "./routes/productRoutes.ts";
import orderRouter from "./routes/orderRoutes.ts";
import adminProductRouter from "./routes/adminProductRoutes.ts";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

app.use("/api/v1/admin", adminProductRouter)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
