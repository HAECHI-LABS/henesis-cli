const os = require("os");

if (os.type() === "Windows_NT") {
    const exec = require('child_process').exec;
    exec('%cd%/bin/setup.cmd', function callback(error, stdout, stderr){
    });
} else {
    const exec = require('child_process').exec;
    exec('sh ./bin/setup', function callback(error, stdout, stderr){
    });
}