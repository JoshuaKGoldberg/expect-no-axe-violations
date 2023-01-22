import type { AxeResults } from "axe-core";
import { describe, expect, it } from "vitest";

import { toHaveNoAxeViolations as matchers } from "./index.js";

const createCheckResult = (id: string) => ({
	id: `check-result-${id}`,
	impact: `Impact: ${id}`,
	message: `Message: ${id}`,
	data: {
		abc: "def",
	},
});

const createViolation = (id: string) => ({
	description: "Example Description",
	help: "Example help",
	helpUrl: "https://example.com",
	id: id,
	tags: [],
	nodes: [
		{
			all: [createCheckResult(id)],
			any: [createCheckResult(id)],
			failureSummary: "It's a failure.",
			html: "<example />",
			none: [createCheckResult(id)],
			target: ["<target />"],
		},
	],
});

describe("toHaveNoAxeViolations", () => {
	it("throws an error when an undefined input is provided", () => {
		expect(() =>
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			matchers.toHaveNoAxeViolations(undefined!)
		).toThrowErrorMatchingInlineSnapshot(
			'"No violations found in aXe results object."'
		);
	});

	it("throws an error when an invalid input is provided", () => {
		expect(() =>
			matchers.toHaveNoAxeViolations({} as AxeResults)
		).toThrowErrorMatchingInlineSnapshot(
			'"No violations found in aXe results object."'
		);
	});

	it("returns an empty array when there are no violations", () => {
		const actual = matchers.toHaveNoAxeViolations({
			violations: [],
		});

		expect(actual).toEqual([]);
	});

	/* cspell:disable */

	it("returns an object when there is a violation", () => {
		const violations = [createViolation("abc123")];
		const actual = matchers.toHaveNoAxeViolations({
			violations,
		});

		expect(actual).toEqual({
			action: violations,
			message: expect.any(Function),
			pass: false,
		});

		expect((actual as Exclude<typeof actual, never[]>).message())
			.toMatchInlineSnapshot(`
				"[2mexpect([22m[31mreceived[39m[2m).toHaveNoViolations([22m[32mexpected[39m[2m)[22m

				Expected the HTML found at $('<target />') to have no violations:

				[90m<example />[39m

				Received:

				[31m\\"Example help (abc123)\\"[39m

				[33mIt's a failure.[39m

				You can find more information on this issue here: 
				[34mhttps://example.com[39m"
			`);
	});

	it("returns an object when there are multiple violations", () => {
		const violations = [createViolation("abc123"), createViolation("def456")];
		const actual = matchers.toHaveNoAxeViolations({
			violations,
		});

		expect(actual).toEqual({
			action: violations,
			message: expect.any(Function),
			pass: false,
		});

		expect((actual as Exclude<typeof actual, never[]>).message())
			.toMatchInlineSnapshot(`
				"[2mexpect([22m[31mreceived[39m[2m).toHaveNoViolations([22m[32mexpected[39m[2m)[22m

				Expected the HTML found at $('<target />') to have no violations:

				[90m<example />[39m

				Received:

				[31m\\"Example help (abc123)\\"[39m

				[33mIt's a failure.[39m

				You can find more information on this issue here: 
				[34mhttps://example.com[39m

				────────

				Expected the HTML found at $('<target />') to have no violations:

				[90m<example />[39m

				Received:

				[31m\\"Example help (def456)\\"[39m

				[33mIt's a failure.[39m

				You can find more information on this issue here: 
				[34mhttps://example.com[39m"
			`);
	});

	/* cspell:enable */
});
