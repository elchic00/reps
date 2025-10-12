'use client';

import CodeEditor from './CodeEditor';

interface CodeEditorWrapperProps {
  challengeId: string;
  starterCode: string;
  language: 'python' | 'javascript';
  testCases: { input: string; expected: string }[];
}

export default function CodeEditorWrapper(props: CodeEditorWrapperProps) {
  const handleSuccess = () => {
    // TODO: Update user_challenges table
    console.log('Challenge completed!');
  };

  return <CodeEditor {...props} onSuccess={handleSuccess} />;
}
