'use client';

import { useState } from 'react';
import CodeEditor from './CodeEditor';

interface CodeEditorWrapperProps {
  challengeId: string;
  starterCodePython: string;
  starterCodeJavaScript: string;
  testCases: { input: string; expected: string }[];
}

export default function CodeEditorWrapper({
  challengeId,
  starterCodePython,
  starterCodeJavaScript,
  testCases,
}: CodeEditorWrapperProps) {
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState(starterCodePython);

  const handleSuccess = () => {
    // TODO: Update user_challenges table
    console.log('Challenge completed!');
  };

  const handleLanguageChange = (newLang: 'python' | 'javascript') => {
    setLanguage(newLang);
    // Switch to the appropriate starter code
    setCode(newLang === 'python' ? starterCodePython : starterCodeJavaScript);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Language Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleLanguageChange('python')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            language === 'python'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Python
        </button>
        <button
          onClick={() => handleLanguageChange('javascript')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            language === 'javascript'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          JavaScript
        </button>
      </div>

      {/* Code Editor */}
      <CodeEditor
        challengeId={challengeId}
        starterCode={code}
        language={language}
        testCases={testCases}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
