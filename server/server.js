/**
 * server.js
 * Created by lintry on 2017/11/23.
 */

module.exports = function (path_list, bind_port, autoOpen) {
    let start_time = Date.now();
    const express = require('express'),
        chalk = require('chalk'),
        opn = require('opn');

    // 定义参数

    const app = new express();

    if (typeof path_list === 'string') {
        path_list = [path_list]
    }
    path_list = path_list || [];
    path_list.forEach(path => {
        app.use('/', express.static(path));
    });

    //启动服务
    const server = app.listen(bind_port, function () {
        let os = require('os');
        let ifaces = os.networkInterfaces();
        let localhost = ['localhost'];
        Object.keys(ifaces).forEach(function (ifname) {
            let alias = 0;

            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }

                if (alias >= 1) {
                    // this single interface has multiple ipv4 addresses
                    localhost.push(iface.address);
                } else {
                    // this interface has only one ipv4 adress
                    localhost.push(iface.address);
                }
                ++alias;
            });
        });

        let server_address = server.address();
        let port = server_address.port;
        let server_list = localhost.map(function (ip) {
            return `http://${ip}:${port}`;
        });
        console.info(chalk.green('Server is listening at:'));
        console.info(chalk.cyan(server_list.join('\n')));
        console.info(chalk.green((ms => `Server startup in ${ms} ms`)(Date.now() - start_time)));
        autoOpen && opn(server_list[0])
    });

    //bind exception event to log
    process.on('uncaughtException', function (e) {
        console.error('uncaughtException from process', e);
        if (e.code === 'EADDRINUSE') {
            console.error(chalk.red(`服务端口${bind_port}被占用!`));
            process.exit(bind_port);
        }
    });

    process.on('unhandledRejection', (e) => {
        console.warn('unhandledRejection from process', e);
    });

    process.on('rejectionHandled', (e) => {
        console.warn('rejectionHandled from process', e);
    });

    server.timeout = 600000;
};