'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';

interface IPCTestResult {
  status: string;
  timestamp: number;
  message?: string;
  error?: string;
  node_env?: string;
  electron_version?: string;
  platform?: string;
  arch?: string;
  cwd?: string;
  dirname?: string;
}

export function IPCTestComponent() {
  const [testResult, setTestResult] = useState<IPCTestResult | null>(null);
  const [detailedResult, setDetailedResult] = useState<IPCTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testBasicIPC = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.test?.ipc) {
        const result = await window.electronAPI.test.ipc();
        setTestResult(result);
        console.log('✅ Basic IPC test successful:', result);
      } else {
        setTestResult({
          status: 'error',
          timestamp: Date.now(),
          error: 'electronAPI.test.ipc is not available'
        });
        console.error('❌ electronAPI.test.ipc is not available');
      }
    } catch (error) {
      const errorResult = {
        status: 'error',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : String(error)
      };
      setTestResult(errorResult);
      console.error('❌ Basic IPC test failed:', error);
    }
    setIsLoading(false);
  };

  const testDetailedIPC = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.test?.ipcDetailed) {
        const result = await window.electronAPI.test.ipcDetailed();
        setDetailedResult(result);
        console.log('✅ Detailed IPC test successful:', result);
      } else {
        setDetailedResult({
          status: 'error',
          timestamp: Date.now(),
          error: 'electronAPI.test.ipcDetailed is not available'
        });
        console.error('❌ electronAPI.test.ipcDetailed is not available');
      }
    } catch (error) {
      const errorResult = {
        status: 'error',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : String(error)
      };
      setDetailedResult(errorResult);
      console.error('❌ Detailed IPC test failed:', error);
    }
    setIsLoading(false);
  };

  const testAIConnection = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.ai?.healthCheck) {
        const result = await window.electronAPI.ai.healthCheck();
        console.log('✅ AI health check result:', result);
      } else {
        console.error('❌ electronAPI.ai.healthCheck is not available');
      }
    } catch (error) {
      console.error('❌ AI health check failed:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800">🔧 IPC 통신 테스트</h2>
      
      <div className="space-y-3">
        <Button 
          onClick={testBasicIPC} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '테스트 중...' : '기본 IPC 테스트'}
        </Button>
        
        <Button 
          onClick={testDetailedIPC} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '테스트 중...' : '상세 IPC 테스트'}
        </Button>

        <Button 
          onClick={testAIConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '테스트 중...' : 'AI 연결 테스트'}
        </Button>
      </div>

      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="font-semibold text-gray-700">기본 IPC 결과:</h3>
          <pre className="text-sm text-gray-600 mt-1">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      {detailedResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="font-semibold text-gray-700">상세 IPC 결과:</h3>
          <pre className="text-sm text-gray-600 mt-1">
            {JSON.stringify(detailedResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
