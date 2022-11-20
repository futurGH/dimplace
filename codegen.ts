import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "./schema.graphql",
	documents: "./src/**/*.{ts,tsx}",
	generates: {
		"./src/app/api/generated.ts": {
			plugins: ["typescript", "typescript-operations", {
				"typescript-rtk-query": { importBaseApiFrom: "./baseApi", exportHooks: true },
			}],
		},
	},
};
export default config;
