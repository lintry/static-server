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
    fs = require('fs-extra'),
    server = require('../server/server')
;

const defaultTable = {
    'proxy_to_remote_host': {
        filter: ['/namespace1/', '/namespace2/'],
        target: 'http://sample.com/',
        changeOrigin: true,
        pathRewrite: {
            '^/(.*)': '/$1',
        }
    },
    'proxy_to_remote_namespace': {
        filter: ['/api1/', '/api2/'],
        target: 'http://sample.com/namespace/',
        changeOrigin: true,
        pathRewrite: {
            '^/namespace/(.*)': '/$1',
        }
    },
    'proxy_to_local': {
        filter: ['/pattern/'],
        target: 'http://localhost:port',
        changeOrigin: true,
        pathRewrite: {
            '^/(.*)': '/$1',
        }
    }
};

const default_json = 'proxy.json';
program
    .version(PKG.version);

program
    .command('start [path...]')
    .alias('i')
    .description('start <path> <path> <path>')
    .option('-P --port', 'bind port')
    .option('-S --silent', 'do not auto open browser')
    .option('-X --proxy [table]', 'use a special proxy table file', default_json)
    .action(start);

program
    .command('init [file]')
    .description('create init proxy table json, default name is ' + default_json)
    .action(init);

program
    .parse(process.argv);

if (process.argv.length === 2) {
    program.outputHelp();
}

function start (path, opts) {
    let port = opts.port || 8080;
    let silent = opts.silent;
    if (!path.length) {
        path = ['public']
    }
    let static_path = (path).map(static_path => {
        return path_utils.resolve(process.cwd(), static_path);
    });

    server(static_path, port, !silent, path_utils.resolve(process.cwd(), opts.proxy))
}


function init (file) {
    file = file || default_json;

    let json_file = path_utils.resolve(process.cwd(), file);
    if (!fs.existsSync(json_file)) {
        fs.ensureFileSync(json_file);
        fs.writeJsonSync(json_file, defaultTable);
        console.info(chalk.cyan(`Created initial proxy-table ${file} successfully!`));
    } else {
        console.error(chalk.red(`${file} is exists, this command is ignored.`))
    }
}