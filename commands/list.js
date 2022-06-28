const conf = new (require('conf'))()
const { exec } = require("child_process");
var fs = require('fs');

function list (csv_name) {
    exec(`cat ./${csv_name} | tty-table`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`${stdout}`);
        return stdout
    });
}

module.exports = list
