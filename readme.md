# Static Server
[![NPM](https://nodei.co/npm/kml-static-server.png)](https://nodei.co/npm/kml-static-server/)

Start static server with cli. It only provid a simple web server for browse a html page. A proxy server can be lauched up when a proxy json file is existed.



## how to install

install via npm

```sh
npm instal kml-static-server -g
```

or install from source code

```sh
git clone https://github.com/lintry/static-server.git
cd static-server
npm link
```

## how to start a server

```sh
kml-server-cli start
Usage: start|i [options] [path...]

  start <path> <path> <path>


  Options:

    -P --port    bind port
    -S --silent  do not auto open browser
    -X --proxy [table]  use proxy table file (default: proxy.json)
    -h, --help   output usage information

```

## how to stop server

**After start a new server, you can press `CTRL-C` to stop it;**



## how to create a proxy.json

```sh
kml-server-cli init
Usage: init [options] [file]

  create init proxy table json, default name is proxy.json
```

