declare namespace NodeJS {
    interface ProcessEnv {
        [key: string]: string | undefined;
    }
}

declare var process: {
    env: NodeJS.ProcessEnv;
    exit?: (code?: number) => void;
    cwd?: () => string;
};

declare module 'fs';
declare module 'path';
