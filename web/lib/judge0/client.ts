import axios from 'axios';

const JUDGE0_API = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.JUDGE0_API_KEY;

// Language IDs for Judge0
export const LANGUAGES = {
  python: 71,  // Python 3
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
  language: 'python' | 'javascript',
  testCases: { input: string; expected: string }[]
) {
  try {
    // Submit code for execution
    const submissions = await Promise.all(
      testCases.map(async (testCase) => {
        const response = await axios.post(
          `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
          {
            source_code: code,
            language_id: LANGUAGES[language],
            stdin: testCase.input,
            expected_output: testCase.expected,
          },
          {
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': JUDGE0_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
          }
        );

        return {
          ...response.data,
          input: testCase.input,
          expected: testCase.expected,
        };
      })
    );

    return submissions;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown }; message?: string };
      console.error('Judge0 error:', axiosError.response?.data || axiosError.message);
    } else {
      console.error('Judge0 error:', error);
    }
    throw error;
  }
}
