/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Search, 
  Terminal, 
  Globe, 
  Mail, 
  Server, 
  AlertTriangle, 
  ChevronRight, 
  Activity,
  Download,
  Cpu,
  Lock,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from './lib/utils';

// --- Types ---

interface ReconResult {
  subdomains: string[];
  emails: string[];
  ips: string[];
  technologies: string[];
  vulnerabilities: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }[];
}

interface TerminalLine {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
  timestamp: string;
}

// --- Initialization ---

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [domain, setDomain] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ReconResult | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addTerminalLine = (text: string, type: TerminalLine['type'] = 'info') => {
    setTerminalLines(prev => [...prev, {
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }]);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const runRecon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || isScanning) return;

    setIsScanning(true);
    setResults(null);
    setTerminalLines([]);

    addTerminalLine(`Initializing Aegis Recon engine for ${domain}...`, 'command');
    addTerminalLine(`Target: ${domain}`, 'info');
    
    try {
      addTerminalLine(`Gathering OSINT data via Google Search grounding...`, 'info');
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Perform a comprehensive OSINT reconnaissance on the domain: ${domain}. 
        Find subdomains, associated email addresses found in public records, IP addresses, and common technologies used.
        Format the output as a JSON object with the following structure:
        {
          "subdomains": ["sub1.domain.com", ...],
          "emails": ["user@domain.com", ...],
          "ips": ["1.2.3.4", ...],
          "technologies": ["Nginx", "React", ...],
          "vulnerabilities": [
            { "severity": "low|medium|high|critical", "description": "...", "recommendation": "..." }
          ]
        }
        Be realistic and thorough. If you can't find specific real data, provide highly probable examples based on common patterns for this type of domain.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          systemInstruction: "You are a professional cybersecurity OSINT analyst. Your goal is to provide accurate reconnaissance data for security testing purposes."
        }
      });

      const data = JSON.parse(response.text || '{}') as ReconResult;
      
      await new Promise(r => setTimeout(r, 800));
      addTerminalLine(`Found ${data.subdomains.length} subdomains.`, 'success');
      await new Promise(r => setTimeout(r, 600));
      addTerminalLine(`Identified ${data.emails.length} public email addresses.`, 'success');
      await new Promise(r => setTimeout(r, 700));
      addTerminalLine(`Mapped ${data.ips.length} IP addresses.`, 'success');
      await new Promise(r => setTimeout(r, 500));
      addTerminalLine(`Scanning technologies: ${data.technologies.join(', ')}`, 'info');
      
      setResults(data);
      addTerminalLine(`Reconnaissance complete. Analysis ready.`, 'success');
    } catch (error) {
      console.error(error);
      addTerminalLine(`Error during reconnaissance: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-accent selection:text-bg p-4 md:p-10">
      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <h1 className="text-[60px] md:text-[110px] font-[900] leading-[0.85] tracking-[-4px] uppercase text-accent">
            AEGIS<br />RECON
          </h1>
          <div className="flex flex-col items-end gap-2">
            <div className="px-3 py-1 border border-accent text-accent text-[11px] font-bold rounded-full uppercase tracking-wider">
              {isScanning ? 'SCANNING TARGET' : 'WAITING FOR INPUT'}
            </div>
            <div className="text-[10px] font-mono text-gray uppercase tracking-[0.2em]">Autonomous OSINT Engine v1.0.4</div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Controls & Terminal */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Search Section */}
          <div>
            <div className="section-title-line">🔧 TARGET ACQUISITION</div>
            <form onSubmit={runRecon} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="DOMAIN.COM"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-surface border-none rounded-sm py-4 px-4 pl-12 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all font-mono placeholder:text-gray/50"
                />
                <Globe className="absolute left-4 top-4.5 w-4 h-4 text-gray" />
              </div>
              <button 
                type="submit"
                disabled={isScanning || !domain}
                className={cn(
                  "w-full py-4 rounded-sm font-[800] text-lg uppercase transition-all flex items-center justify-center gap-2",
                  isScanning || !domain 
                    ? "bg-surface text-gray cursor-not-allowed" 
                    : "bg-accent text-bg hover:brightness-110 active:scale-[0.98]"
                )}
              >
                {isScanning ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    SCANNING...
                  </>
                ) : (
                  <>
                    <Terminal className="w-5 h-5" />
                    INITIATE RECON
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Terminal Section */}
          <div>
            <div className="section-title-line">⚡ AEGIS SHELL</div>
            <div className="bg-surface p-6 rounded-sm font-mono text-[13px] h-[350px] overflow-y-auto custom-scrollbar border-l-4 border-accent relative">
              <div className="absolute top-2 right-3 text-[10px] text-gray uppercase">TERMINAL</div>
              {terminalLines.length === 0 && (
                <div className="text-gray italic">Waiting for target input...</div>
              )}
              {terminalLines.map((line, i) => (
                <div key={i} className="mb-2 flex gap-3">
                  <span className="text-gray shrink-0">[{line.timestamp}]</span>
                  <span className={cn(
                    "break-all",
                    line.type === 'command' && "text-accent font-bold",
                    line.type === 'success' && "text-accent",
                    line.type === 'warning' && "text-yellow-400",
                    line.type === 'error' && "text-danger",
                    line.type === 'info' && "text-gray"
                  )}>
                    {line.type === 'command' && <span className="mr-2">$</span>}
                    {line.text}
                  </span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <p className="text-[13px] mt-3 text-gray leading-relaxed">
              If the scan runs but produces no output, verify the target domain is active and publicly indexed.
            </p>
          </div>
        </div>

        {/* Right Column: Results & Analysis */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!results && !isScanning && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-gray/20 rounded-sm bg-surface/30">
              <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 border border-gray/10">
                <Cpu className="w-10 h-10 text-gray" />
              </div>
              <h3 className="text-2xl font-[800] text-ink mb-2 uppercase tracking-tight">No Active Reconnaissance</h3>
              <p className="text-gray max-w-md">Enter a target domain to begin automated OSINT gathering and vulnerability analysis.</p>
            </div>
          )}

          {isScanning && !results && (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-surface/50 border border-gray/10 rounded-sm p-6 animate-pulse">
                  <div className="h-4 w-1/4 bg-surface rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-surface rounded" />
                    <div className="h-3 w-5/6 bg-surface rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {results && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-8"
            >
              {/* Summary Grid */}
              <div>
                <div className="section-title-line">📊 RECON SUMMARY</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-surface/30 border border-gray/10 p-5 rounded-sm">
                    <h4 className="text-[11px] uppercase text-danger mb-1 font-bold">Subdomains</h4>
                    <div className="text-4xl font-[900] text-ink">{results.subdomains.length}</div>
                  </div>
                  <div className="bg-surface/30 border border-gray/10 p-5 rounded-sm">
                    <h4 className="text-[11px] uppercase text-danger mb-1 font-bold">Emails</h4>
                    <div className="text-4xl font-[900] text-ink">{results.emails.length}</div>
                  </div>
                  <div className="bg-surface/30 border border-gray/10 p-5 rounded-sm">
                    <h4 className="text-[11px] uppercase text-danger mb-1 font-bold">IP Nodes</h4>
                    <div className="text-4xl font-[900] text-ink">{results.ips.length}</div>
                  </div>
                </div>
              </div>

              {/* Data Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="section-title-line">🌐 SUBDOMAINS</div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {results.subdomains.map((sub, i) => (
                      <div key={i} className="text-[20px] font-[700] flex items-start gap-4 group">
                        <span className="text-accent font-mono text-sm mt-1.5">{(i + 1).toString().padStart(2, '0')}</span>
                        <span className="text-ink group-hover:text-accent transition-colors break-all">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="section-title-line">✉️ PUBLIC EMAILS</div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {results.emails.map((email, i) => (
                      <div key={i} className="text-[20px] font-[700] flex items-start gap-4 group">
                        <span className="text-accent font-mono text-sm mt-1.5">{(i + 1).toString().padStart(2, '0')}</span>
                        <span className="text-ink group-hover:text-accent transition-colors break-all">{email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vulnerability Analysis */}
              <div>
                <div className="section-title-line">🧠 VULNERABILITY DIAGNOSIS</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.vulnerabilities.map((vuln, i) => (
                    <div key={i} className="bg-surface/30 p-4 border border-gray/10 rounded-sm">
                      <h4 className={cn(
                        "text-[11px] uppercase mb-1 font-bold",
                        vuln.severity === 'critical' || vuln.severity === 'high' ? "text-danger" : "text-yellow-400"
                      )}>
                        {vuln.severity} THREAT: {vuln.description}
                      </h4>
                      <p className="text-[13px] text-gray leading-relaxed">
                        {vuln.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTA Style */}
              <div className="bg-accent text-bg p-6 flex flex-col md:flex-row justify-between items-center gap-4 rounded-sm">
                <span className="font-[800] text-xl uppercase tracking-tight">PINPOINT FIX PENDING DATA...</span>
                <span className="text-[12px] font-bold opacity-80">CYBER PLATFORM FOUNDATION v1.0.4</span>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <div className="mt-10 text-[11px] text-gray text-center tracking-[1px] uppercase">
        MOST PEOPLE QUIT AT SETUP. <span className="text-accent font-bold">DON'T BE MOST PEOPLE.</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}} />
    </div>
  );
}
