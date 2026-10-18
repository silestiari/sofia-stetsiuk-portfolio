import { defineConfig } from "@playwright/test";

const port = 3100;

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://localhost:${port}/en`,
    reuseExistingServer: !process.env.CI,
  },
});
