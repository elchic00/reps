import axios from "axios";

const JUDGE0_API =
  process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = process.env.JUDGE0_API_KEY;

// Language IDs for Judge0
export const LANGUAGES = {
  python: 71, // Python 3
  javascript: 63, // JavaScript (Node.js)
};

export interface ExecutionResult {
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time: string;
  memory: number;
}

export async function executeCode(
  code: string,
  language: "python" | "javascript",
  testCases: { args: unknown[]; expected: unknown }[]
) {
  try {
    const submissions = await Promise.all(
      testCases.map(async (testCase) => {
        // Build the complete program
        let fullCode = "";

        if (language === "python") {
          fullCode = `
import json
${code}

# Execute test
result = two_sum(${JSON.stringify(testCase.args[0])}, ${testCase.args[1]})
print(json.dumps(result))
`;
        } else if (language === "javascript") {
          fullCode = `
${code}

// Execute test
const result = twoSum(${JSON.stringify(testCase.args[0])}, ${testCase.args[1]});
console.log(JSON.stringify(result));
`;
        }

        const response = await axios.post(
          `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
          {
            source_code: fullCode,
            language_id: LANGUAGES[language],
            stdin: "",
          },
          {
            headers: {
              "content-type": "application/json",
              "X-RapidAPI-Key": JUDGE0_KEY,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        const output = response.data.stdout?.trim();
        const expected = JSON.stringify(testCase.expected);

        return {
          ...response.data,
          passed: output === expected,
          actual: output,
          expected: expected,
        };
      })
    );

    return submissions;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("Judge0 error:", err.response?.data || err.message);
    throw error;
  }
}
