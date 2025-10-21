export interface FileSystem {
  [key: string]: {
    type: 'file' | 'directory';
    content?: string;
    children?: FileSystem;
  };
}

export interface TerminalState {
  currentPath: string[];
  fileSystem: FileSystem;
  history: string[];
}

export const initialFileSystem: FileSystem = {
  home: {
    type: 'directory',
    children: {
      'readme.txt': {
        type: 'file',
        content: 'Bem-vindo ao Terminal Android!\nUse "help" para ver comandos disponíveis.'
      },
      'projects': {
        type: 'directory',
        children: {
          'app.js': {
            type: 'file',
            content: 'console.log("Hello from Android Terminal!");'
          }
        }
      },
      'documents': {
        type: 'directory',
        children: {}
      }
    }
  }
};

export const getFullPath = (path: string[]): string => {
  return '/' + path.join('/');
};

export const getCurrentDirectory = (fs: FileSystem, path: string[]): FileSystem | null => {
  let current: any = fs;
  for (const dir of path) {
    if (current[dir] && current[dir].type === 'directory') {
      current = current[dir].children;
    } else {
      return null;
    }
  }
  return current;
};

export const executeCommand = (
  command: string,
  state: TerminalState
): { output: string[]; newState: TerminalState } => {
  const parts = command.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  let output: string[] = [];
  let newState = { ...state };

  switch (cmd) {
    case 'help':
      output = [
        '╔════════════════════════════════════════════╗',
        '║        COMANDOS DISPONÍVEIS                ║',
        '╚════════════════════════════════════════════╝',
        '',
        '  ls              - Lista arquivos e diretórios',
        '  cd <dir>        - Navega para diretório',
        '  pwd             - Mostra diretório atual',
        '  cat <arquivo>   - Mostra conteúdo do arquivo',
        '  clear           - Limpa a tela',
        '  echo <texto>    - Imprime texto',
        '  date            - Mostra data e hora',
        '  whoami          - Mostra usuário atual',
        '  uname           - Informações do sistema',
        '  mkdir <dir>     - Cria diretório',
        '  touch <arquivo> - Cria arquivo',
        '  help            - Mostra esta ajuda',
        ''
      ];
      break;

    case 'clear':
      output = ['CLEAR_SCREEN'];
      break;

    case 'ls':
      const currentDir = getCurrentDirectory(state.fileSystem, state.currentPath);
      if (currentDir) {
        output = [''];
        Object.keys(currentDir).forEach(name => {
          const item = currentDir[name];
          const icon = item.type === 'directory' ? '📁' : '📄';
          output.push(`${icon} ${name}`);
        });
        output.push('');
      } else {
        output = ['Erro: Diretório não encontrado'];
      }
      break;

    case 'pwd':
      output = [getFullPath(state.currentPath)];
      break;

    case 'cd':
      if (args.length === 0) {
        newState.currentPath = ['home'];
        output = [''];
      } else if (args[0] === '..') {
        if (state.currentPath.length > 1) {
          newState.currentPath = state.currentPath.slice(0, -1);
        }
        output = [''];
      } else {
        const targetDir = getCurrentDirectory(state.fileSystem, state.currentPath);
        if (targetDir && targetDir[args[0]] && targetDir[args[0]].type === 'directory') {
          newState.currentPath = [...state.currentPath, args[0]];
          output = [''];
        } else {
          output = [`cd: ${args[0]}: Diretório não encontrado`];
        }
      }
      break;

    case 'cat':
      if (args.length === 0) {
        output = ['cat: faltando operando arquivo'];
      } else {
        const currentDir = getCurrentDirectory(state.fileSystem, state.currentPath);
        if (currentDir && currentDir[args[0]] && currentDir[args[0]].type === 'file') {
          output = ['', currentDir[args[0]].content || '', ''];
        } else {
          output = [`cat: ${args[0]}: Arquivo não encontrado`];
        }
      }
      break;

    case 'echo':
      output = [args.join(' ')];
      break;

    case 'date':
      output = [new Date().toLocaleString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })];
      break;

    case 'whoami':
      output = ['root@android-terminal'];
      break;

    case 'uname':
      output = ['Android Terminal v1.0 - JavaScript Runtime'];
      break;

    case 'mkdir':
      if (args.length === 0) {
        output = ['mkdir: faltando operando'];
      } else {
        const currentDir = getCurrentDirectory(state.fileSystem, state.currentPath);
        if (currentDir && !currentDir[args[0]]) {
          currentDir[args[0]] = {
            type: 'directory',
            children: {}
          };
          output = [''];
        } else {
          output = [`mkdir: não foi possível criar diretório '${args[0]}'`];
        }
      }
      break;

    case 'touch':
      if (args.length === 0) {
        output = ['touch: faltando operando arquivo'];
      } else {
        const currentDir = getCurrentDirectory(state.fileSystem, state.currentPath);
        if (currentDir && !currentDir[args[0]]) {
          currentDir[args[0]] = {
            type: 'file',
            content: ''
          };
          output = [''];
        } else {
          output = [`touch: não foi possível criar arquivo '${args[0]}'`];
        }
      }
      break;

    case '':
      output = [''];
      break;

    default:
      output = [`${cmd}: comando não encontrado. Digite 'help' para ver comandos disponíveis.`];
  }

  return { output, newState };
};
