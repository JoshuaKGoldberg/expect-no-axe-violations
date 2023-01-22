import { defineConfig } from "vitest/config";

export default defineConfig({
	envPrefix: "FORCE_",
	test: {
		clearMocks: true,
		coverage: {
			all: true,
			exclude: ["lib"],
			include: ["src"],
			provider: "istanbul",
			reporter: ["html", "lcov"],
		},
		exclude: ["lib", "node_modules"],
	},
});
