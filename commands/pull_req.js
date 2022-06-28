var fs   = require('fs')
const csv = require('csv-parser');
const { exec } = require("child_process");
const git_repo = require('./git_repo.js')
const {bash_comm, generate_new} = require('./update_pkg.js')

function getData(file, type) {
  let data = [];
  return new Promise((resolve, reject) => {
      fs.createReadStream(file)
          .on('error', error => {
              reject(error);
          })
          .pipe(csv({headers: true, separator: ','}))
          .on('data', (row) => {
            //   console.log(row._1)
              data.push(row._1);
          })
          .on('end', () => {
              resolve(data);
          });
  });
}

async function pull_req(name_ver) {
    const data = await getData("./dyte.csv", {});
    data.splice(0,1)
    
    name_ver = name_ver.toString()
    var name = name_ver.substr(0, name_ver.indexOf('@'));
    var ver = name_ver.substr(name_ver.indexOf('@')+1);

    data.forEach(gitlink => {    
        var s = "https://raw.githubusercontent.com/"+gitlink.toString().substring(19)+"main/package.json";
                
        exec(
            `curl --silent ${s} --stderr - | grep -w ${name}`,
            (error, stdout, stderr) => {
            var stdout = stdout.toString()
            // console.log(stdout);
            curr_ver = stdout.substring(10+name.length,stdout.length-3)
            if(curr_ver>=ver) flag = true; else flag = false;             

            if(!flag){
                bash_comm(s)
                function myFunction() {
                    timeout = setTimeout(generate_new(curr_ver), 4000);
                }
                // generate_new(ver)
                
                let owner = gitlink.substring(19,26)
                let repo = gitlink.substring(27,gitlink.length-1)
                let message = `Update ${name} from ${curr_ver} to ${ver}`
                // git_repo(owner, repo, message)
                // console.log(owner,repo)
            }
        })
    });
    console.log("pull request created successfully.")
}

module.exports = pull_req;
