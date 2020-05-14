"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const client_1 = __importDefault(require("./client"));
const graphql_language_service_server_1 = require("graphql-language-service-server");
const { argv } = yargs_1.default
    .usage('GraphQL Language Service Command-Line Interface.\n' +
    'Usage: $0 <command> <file>\n' +
    '    [-h | --help]\n' +
    '    [-c | --configDir] {configDir}\n' +
    '    [-t | --text] {textBuffer}\n' +
    '    [-f | --file] {filePath}\n' +
    '    [-s | --schema] {schemaPath}\n' +
    '    [-m | --method] {method}\n' +
    '    [-p | --port] {port}\n' +
    '\n    At least one command is required.\n')
    .help('h')
    .alias('h', 'help')
    .strict()
    .recommendCommands()
    .demandCommand(1, 'At least one command is required.\n' +
    'Commands: "server, validate, autocomplete, outline"\n')
    .command('server', 'GraphQL language server service')
    .command('validate', 'Validates the query')
    .command('autocomplete', 'Get autocomplete suggestions')
    .command('outline', 'Get outline')
    .option('t', {
    alias: 'text',
    describe: 'Text buffer to perform GraphQL diagnostics on.\n' +
        'Will defer to --file option if omitted.\n' +
        'Overrides the --file option, if any.\n',
    type: 'string',
})
    .option('f', {
    alias: 'file',
    describe: 'File path to perform GraphQL diagnostics on.\n' +
        'Will be ignored if --text option is supplied.\n',
    type: 'string',
})
    .option('row', {
    describe: 'A row number from the cursor location for ' +
        'GraphQL autocomplete suggestions.\n' +
        'If omitted, the last row number will be used.\n',
    type: 'number',
})
    .option('column', {
    describe: 'A column number from the cursor location for ' +
        'GraphQL autocomplete suggestions.\n' +
        'If omitted, the last column number will be used.\n',
    type: 'number',
})
    .option('c', {
    alias: 'configDir',
    describe: 'Path to the .graphqlrc configuration file.\n' +
        'Walks up the directory tree from the provided config directory, or ' +
        'the current working directory, until a .graphqlrc is found or ' +
        'the root directory is found.\n',
    type: 'string',
})
    .option('m', {
    alias: 'method',
    describe: 'A IPC communication method between client and server.\n' +
        'Can be one of: stream, node, socket.\n' +
        'Will default to use a node IPC channel for communication.\n',
    type: 'string',
    default: 'node',
})
    .option('p', {
    alias: 'port',
    describe: 'Port number to communicate via socket.\n' +
        'The port number of a service running inside the IDE that the language ' +
        'service should connect to.\n' +
        'Required if the client communicates via socket connection.\n',
    type: 'number',
})
    .option('s', {
    alias: 'schemaPath',
    describe: 'a path to schema DSL file\n',
    type: 'string',
});
const command = argv._.pop();
if (!command) {
    throw Error('no command supplied');
}
switch (command) {
    case 'server':
        process.on('uncaughtException', error => {
            process.stdout.write('An error was thrown from GraphQL language service: ' + String(error));
            process.exit(0);
        });
        const options = {};
        if (argv && argv.port) {
            options.port = argv.port;
        }
        if (argv && argv.method) {
            options.method = argv.method;
        }
        if (argv && argv.configDir) {
            options.configDir = argv.configDir;
        }
        try {
            graphql_language_service_server_1.startServer(options);
        }
        catch (error) {
            const logger = new graphql_language_service_server_1.Logger();
            logger.error(error);
        }
        break;
    default: {
        client_1.default(command, argv);
        break;
    }
}
process.stdin.on('close', () => {
    process.exit(0);
});
//# sourceMappingURL=cli.js.map