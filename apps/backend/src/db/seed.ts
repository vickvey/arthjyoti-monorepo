import { db } from "./index";
import { users, categories, transactions } from "./schema";
import { generateUUID } from "@/utils/generate-uuid";

async function main() {
  const userId = generateUUID();
  await db.insert(users).values({
    id: userId,
    email: "test@example.com",
    password: "hashed-password-here",
    role: "standard",
  });

  const groceriesId = generateUUID();
  const billsId = generateUUID();

  await db.insert(categories).values([
    {
      id: groceriesId,
      name: "Groceries",
      description: "Groceries and food",
      color: "green",
      userId: userId,
    },
    {
      id: billsId,
      name: "Bills",
      description: "Electricity and internet bills",
      color: "yellow",
      userId: userId,
    },
  ]);

  await db.insert(transactions).values([
    {
      id: generateUUID(),
      amount: 1500,
      type: "expenditure",
      description: "Monthly grocery shopping",
      currency: "INR",
      date: new Date().toISOString(),
      userId: userId,
      categoryId: groceriesId,
    },
    {
      id: generateUUID(),
      amount: 800,
      type: "expenditure",
      description: "Electricity bill",
      currency: "INR",
      date: new Date().toISOString(),
      userId: userId,
      categoryId: billsId,
    },
  ]);
}

main()
  .then(() => {
    console.log("✅ Seed completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
