const fs = require('fs');
const inquirer = require('inquirer');

async function add(name, repo) {
    const data = [{
        type: 'input',
        name: 'name',
        message: "Enter the name of the repository",
      },
      {
        type: 'input',
        name: 'repo',
        message: "Enter the Repository link",
      }]

    function dataEntry() {
        console.log("Add a new row info or press Ctrl+C to exit the script")
        inquirer.prompt(data).then(entry => {
        fs.appendFile('./dyte.csv', `${(entry['name'])},${(entry['repo'])}\r\n`, function (err) {
            if (err) throw err;
            console.log('Saved!');
            dataEntry();
        });
        });
    }
    dataEntry();
}

module.exports = add;


// ❯ curl --silent https://github.com/dyte-in/react-sample-app/blob/main/package.json --stderr - |grep -w "axios" | grep "[0-9].[0-99].[0-9]<span"
// ❯ curl --silent https://raw.githubusercontent.com/dyte-in/react-sample-app/main/package.json --stderr - |grep -w "axios" | grep "[0-9].[0-99].[0-9]<span"
// ❯ cat dyte.csv | column -t -s
// ❯ cat dyte.csv | tty-table
// "wget -P ./pkg https://raw.githubusercontent.com/dyte-in/react-sample-app/main/package.json | tty-table", 

// https://github.com/dyte-in/backend-sample-app
// https://raw.githubusercontent.com/dyte-in/backend-sample-app/main/package.json