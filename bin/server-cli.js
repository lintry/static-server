#!/usr/bin/env node

/**
 * server-cli
 * Created by lintry on 2017/11/23.
 */

const
    path_utils = require('path'),
    PKG = require('../package.json'),
    chalk = require('chalk'),
    program = require('commander'),
    server = require('../server/server')
;

program
    .version(PKG.version);

program
    .command('start [path...]')
    .alias('i')
    .description('start <path> <path> <path>')
    .option('-P --port', 'bind port')
    .option('-S --silent', 'do not auto open browser')
    .action(start);

program
    .parse(process.argv);

if (process.argv.length === 2) {
    program.outputHelp();
}

function start(path, opts) {
    let port = opts.port || 8080;
    let silent = opts.silent;
    let static_path = (path || ['public']).map(static_path => {
        return path_utils.resolve(process.cwd(), static_path);
    });

    server(static_path, port, !silent)
}