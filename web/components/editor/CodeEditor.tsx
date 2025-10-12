'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual?: string;
  error?: string;
  time?: string;
  memory?: number;
}

interface CodeEditorProps {
  challengeId?: string;
  starterCode: string;
  language: 'python' | 'javascript';
  testCases: { input: string; expected: string }[];
  onSuccess?: () => void;
}

export default function CodeEditor({
  starterCode,
  language,
  testCases,
  onSuccess,
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute code');
      }

      const results = await response.json();
      setTestResults(results);

      // Check if all tests passed
      const allPassed = results.every((r: TestResult) => r.passed);
      if (allPassed && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error running code:', error);
      alert('Failed to run code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 border rounded-lg overflow-hidden min-h-[400px]">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>

      <div className="mt-4">
        <Button
          onClick={handleRunCode}
          disabled={isRunning}
          className="w-full"
          size="lg"
        >
          {isRunning ? (
            <>Running Tests...</>
          ) : (
            <>
              <PlayIcon className="w-4 h-4 mr-2" />
              Run Code
            </>
          )}
        </Button>
      </div>

      {testResults.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-lg">Test Results:</h3>
          {testResults.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                {result.passed ? (
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                ) : (
                  <XMarkIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    Test Case {index + 1}: {result.passed ? 'Passed ✓' : 'Failed ✗'}
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Input:</span> {result.input}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Expected:</span> {result.expected}
                    </p>
                    {!result.passed && result.actual && (
                      <p className="text-red-600">
                        <span className="font-medium">Got:</span> {result.actual}
                      </p>
                    )}
                    {result.error && (
                      <p className="text-red-600">
                        <span className="font-medium">Error:</span> {result.error}
                      </p>
                    )}
                    {result.time && (
                      <p className="text-gray-500">
                        <span className="font-medium">Time:</span> {result.time}s
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {testResults.every(r => r.passed) && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                🎉 All tests passed! Great job!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
