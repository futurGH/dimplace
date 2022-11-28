import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "./schema.graphql",
	documents: "./src/**/*.{ts,tsx}",
	generates: { "./src/gql/": { preset: "client", plugins: [] } },
};
export default config;
