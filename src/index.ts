import { EOL } from "node:os";

import type { AxeResults } from "axe-core";
import chalk from "chalk";
import { matcherHint, printReceived } from "jest-matcher-utils";

const lineBreak = EOL.repeat(2);
const horizontalLine = `${lineBreak}\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500${lineBreak}`;

// Error messaging here is intentionally roughly the same as:
// https://github.com/NickColley/jest-axe/blob/f16eaec2a360f2da6d10058423b5a0827b10e8ae/index.js#L123
// Jest-axe displays violations very nicely and diverging could be confusing to users.
export const toHaveNoAxeViolations = {
	toHaveNoAxeViolations(results: Pick<AxeResults, "violations">) {
		if (!(results as Partial<typeof results> | undefined)?.violations) {
			throw new Error("No violations found in aXe results object.");
		}

		if (!results.violations.length) {
			return [];
		}

		return {
			action: results.violations,
			message: () => {
				return [
					matcherHint(".toHaveNoViolations"),
					results.violations
						.map((violation) => {
							return violation.nodes
								.map((node) => {
									const selector = node.target.join(", ");
									return [
										`Expected the HTML found at $('${selector}') to have no violations:`,
										chalk.grey(node.html),
										`Received:`,
										printReceived(`${violation.help} (${violation.id})`),
										chalk.yellow(node.failureSummary),
										violation.helpUrl
											? `You can find more information on this issue here: \n${chalk.blue(
													violation.helpUrl
											  )}`
											: "",
									].join(lineBreak);
								})
								.join(lineBreak);
						})
						.join(horizontalLine),
				].join(lineBreak);
			},
			pass: false,
		};
	},
};
