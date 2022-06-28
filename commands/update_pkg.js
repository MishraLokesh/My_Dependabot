var fs = require('fs');
const { exec } = require("child_process");

var cont;
// Downloading the contents of package.json file
function bash_comm(url) {
  exec(
      // `wget -P ./pkg ${url}`,
      `wget -qP ./pkg https://raw.githubusercontent.com/dyte-in/react-sample-app/main/package.json`,
      (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
    })
  }

function generate_new(val){
  let content = JSON.parse(fs.readFileSync('./pkg/package.json', 'utf8'));
  content.dependencies.axios = `"${val}"`;
  fs.writeFileSync('./pkg/new_package.json', JSON.stringify(content, null, 2));
}

bash_comm()
module.exports = {
  bash_comm,
  generate_new
}

