import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { executeCommand, initialFileSystem, TerminalState, getFullPath } from '@/lib/terminal-commands';

interface OutputLine {
  type: 'command' | 'output' | 'error';
  content: string;
  prompt?: string;
}

const Terminal = () => {
  const [terminalState, setTerminalState] = useState<TerminalState>({
    currentPath: ['home'],
    fileSystem: initialFileSystem,
    history: []
  });
  
  const [output, setOutput] = useState<OutputLine[]>([
    { type: 'output', content: '╔════════════════════════════════════════════════════╗' },
    { type: 'output', content: '║     TERMINAL ANDROID - JavaScript Runtime         ║' },
    { type: 'output', content: '╚════════════════════════════════════════════════════╝' },
    { type: 'output', content: '' },
    { type: 'output', content: '  Bem-vindo ao Terminal Android!' },
    { type: 'output', content: '  Digite "help" para ver os comandos disponíveis.' },
    { type: 'output', content: '' }
  ]);
  
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    
    if (trimmedCmd) {
      setTerminalState(prev => ({
        ...prev,
        history: [...prev.history, trimmedCmd]
      }));
    }

    const prompt = `root@android:${getFullPath(terminalState.currentPath)}$`;
    setOutput(prev => [...prev, { type: 'command', content: trimmedCmd, prompt }]);

    if (trimmedCmd === '') {
      setInput('');
      setHistoryIndex(-1);
      return;
    }

    const { output: cmdOutput, newState } = executeCommand(trimmedCmd, terminalState);

    if (cmdOutput[0] === 'CLEAR_SCREEN') {
      setOutput([]);
    } else {
      setOutput(prev => [
        ...prev,
        ...cmdOutput.map(line => ({ type: 'output' as const, content: line }))
      ]);
    }

    setTerminalState(newState);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (terminalState.history.length > 0) {
        const newIndex = historyIndex === -1 
          ? terminalState.history.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(terminalState.history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= terminalState.history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(terminalState.history[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Autocompletar básico poderia ser implementado aqui
    }
  };

  const currentPrompt = `root@android:${getFullPath(terminalState.currentPath)}$`;

  return (
    <div 
      className="h-screen w-screen bg-terminal-bg overflow-hidden flex flex-col relative"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute w-full h-1 bg-gradient-to-b from-transparent via-terminal-text to-transparent animate-[scan-line_8s_linear_infinite]" />
      </div>

      {/* Terminal header */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center gap-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <div className="w-3 h-3 rounded-full bg-warning" />
          <div className="w-3 h-3 rounded-full bg-success" />
        </div>
        <span className="text-terminal-text text-sm ml-2 font-mono">terminal@android</span>
      </div>

      {/* Terminal output */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
      >
        {output.map((line, idx) => (
          <div key={idx} className="leading-relaxed">
            {line.type === 'command' ? (
              <div className="flex gap-2">
                <span className="text-terminal-prompt font-bold">{line.prompt}</span>
                <span className="text-terminal-text">{line.content}</span>
              </div>
            ) : (
              <div className={`${
                line.content.includes('Erro') || line.content.includes('não encontrado') 
                  ? 'text-terminal-error' 
                  : 'text-terminal-text'
              }`}>
                {line.content}
              </div>
            )}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex gap-2 items-center mt-1">
          <span className="text-terminal-prompt font-bold shrink-0">{currentPrompt}</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-terminal-text outline-none font-mono caret-terminal-text"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-card border-t border-border px-4 py-1 text-xs text-muted-foreground font-mono shrink-0 flex justify-between">
        <span>JavaScript Runtime</span>
        <span>{getFullPath(terminalState.currentPath)}</span>
      </div>
    </div>
  );
};

export default Terminal;
