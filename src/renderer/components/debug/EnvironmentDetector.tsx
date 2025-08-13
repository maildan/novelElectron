// 🔥 환경 감지 및 디버깅 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
import { Logger } from '../../../shared/logger';

interface EnvironmentInfo {
  userAgent: string;
  isElectron: boolean;
  hasElectronAPI: boolean;
  electronAPIKeys: string[];
  currentUrl: string;
  nodeEnv: string;
  isClient: boolean;
}

export const EnvironmentDetector: React.FC = () => {
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const info: EnvironmentInfo = {
      userAgent: navigator.userAgent,
      isElectron: navigator.userAgent.toLowerCase().includes('electron'),
      hasElectronAPI: !!window.electronAPI,
      electronAPIKeys: window.electronAPI ? Object.keys(window.electronAPI) : [],
      currentUrl: window.location.href,
      nodeEnv: process.env.NODE_ENV || 'unknown',
      isClient: true,
    };

    setEnvInfo(info);
    Logger.info('ENV_DETECTOR', '🔍 Environment Information', info);
  }, []);

  const runIPCTests = async (): Promise<void> => {
    const results: any[] = [];
    
    try {
      if (!window.electronAPI) {
        results.push({ test: 'electronAPI_check', success: false, error: 'window.electronAPI is undefined' });
        setTestResults(results);
        return;
      }

      // Test 1: Basic IPC test
      try {
        const basicTest = await window.electronAPI.test.ipc();
        results.push({ test: 'basic_ipc', success: true, result: basicTest });
      } catch (error) {
        results.push({ test: 'basic_ipc', success: false, error: String(error) });
      }

      // Test 2: Detailed IPC test
      try {
        const detailedTest = await window.electronAPI.test.ipcDetailed();
        results.push({ test: 'detailed_ipc', success: true, result: detailedTest });
      } catch (error) {
        results.push({ test: 'detailed_ipc', success: false, error: String(error) });
      }

      // Test 3: Projects API test
      try {
        const projectsTest = await window.electronAPI.projects.getAll();
        results.push({ test: 'projects_api', success: true, result: projectsTest });
      } catch (error) {
        results.push({ test: 'projects_api', success: false, error: String(error) });
      }

    } catch (error) {
      results.push({ test: 'general_error', success: false, error: String(error) });
    }

    setTestResults(results);
    Logger.info('ENV_DETECTOR', '🧪 IPC Test Results', results);
  };

  if (!envInfo) {
    return <div className="p-4 bg-gray-100 rounded">Loading environment info...</div>;
  }

  return (
    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-bold mb-4">🔍 Environment Detector</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="font-semibold mb-2">Environment Info:</h4>
          <div className="text-sm space-y-1">
            <p><strong>Is Electron:</strong> {envInfo.isElectron ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Has ElectronAPI:</strong> {envInfo.hasElectronAPI ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Current URL:</strong> {envInfo.currentUrl}</p>
            <p><strong>NODE_ENV:</strong> {envInfo.nodeEnv}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">ElectronAPI Keys:</h4>
          <div className="text-sm">
            {envInfo.electronAPIKeys.length > 0 ? (
              <ul className="list-disc list-inside">
                {envInfo.electronAPIKeys.map(key => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            ) : (
              <p className="text-red-600">No keys available</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">User Agent:</h4>
        <p className="text-xs bg-gray-100 p-2 rounded font-mono break-all">
          {envInfo.userAgent}
        </p>
      </div>

      <div className="mb-4">
        <button 
          onClick={runIPCTests}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={!envInfo.hasElectronAPI}
        >
          🧪 Run IPC Tests
        </button>
      </div>

      {testResults.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Test Results:</h4>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className={`p-3 rounded text-sm ${
                result.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
              }`}>
                <div className="font-semibold">
                  {result.success ? '✅' : '❌'} {result.test}
                </div>
                {result.success ? (
                  <pre className="mt-1 text-xs">{JSON.stringify(result.result, null, 2)}</pre>
                ) : (
                  <p className="mt-1 text-red-700">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!envInfo.hasElectronAPI && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <h4 className="font-semibold text-red-800 mb-2">❌ ElectronAPI Not Available</h4>
          <p className="text-red-700 mb-3">
            You are running in a browser environment. To use all features, run the Electron app:
          </p>
          <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
            <p>$ cd /Users/user/loop/loop</p>
            <p>$ pnpm dev</p>
          </div>
        </div>
      )}
    </div>
  );
};
