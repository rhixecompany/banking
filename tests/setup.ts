import { cleanup } from "@testing-library/react";
import { config } from "dotenv";
import { resolve } from "path";
import { afterEach } from "vitest";

config({ path: resolve(process.cwd(), ".env.local") });

afterEach(cleanup);
