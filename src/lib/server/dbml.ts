// dbml.ts
import * as schema from "./schema/index";
import { pgGenerate } from "drizzle-dbml-generator";

const out = "src/lib/server/schema.dbml";
const relational = true;
pgGenerate({ schema, out, relational });
console.log("✅ Created the schema.dbml file");
console.log("⏳ Creating the erd.svg file");
