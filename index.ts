import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

import userRouter from "./api/routes/user.routes";
import transactionRouter from "./api/routes/transaction.routes";
import categoryRouter from "./api/routes/category.routes";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Cashflow API");
});

userRouter(app);
transactionRouter(app);
categoryRouter(app);

app.get("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
