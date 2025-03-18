import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

import userRouter from "./api/app/routes/user.routes";
import transactionRouter from "./api/app/routes/transaction.routes";
import categoryRouter from "./api/app/routes/category.routes";
import budgetingRouter from "./api/app/routes/budgeting.routes";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
    ],
  })
);
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Cashflow API");
});

userRouter(app);
transactionRouter(app);
categoryRouter(app);
budgetingRouter(app);

app.get("*", (req: Request, res: Response) => {
  res.status(404).send({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
