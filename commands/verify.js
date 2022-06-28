const conf = new (require('conf'))()
const chalk = require('chalk')
const { exec } = require("child_process");

var csv = require('csv-parser');
var {parse} = require('csv-parse');
var fs = require('fs');
var json2csv = require('json2csv').parse;
var stringify = require('csv-stringify');
var flag;var curr_ver;

const results = [];
var curr_ver_array;
var ver_sat_array;

async function verify(name_ver) {
    name_ver = name_ver.toString()
    var name = name_ver.substr(0, name_ver.indexOf('@'));
    var ver = name_ver.substr(name_ver.indexOf('@')+1);
    console.log(name)
    console.log(ver)


    var parser = await parse({columns: true}, function (err, records) {
        records.forEach((element, index, array) => {
            // console.log(element.repo);
            gitlink = element.repo
            // console.log(records[0]);
            var s = "https://raw.githubusercontent.com/"+gitlink.toString().substring(19)+"main/package.json";
            // console.log(s)
            
            exec(
                `curl --silent ${s} --stderr - | grep -w ${name}`,
                (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                var stdout = stdout.toString()
                // console.log(stdout);
                curr_ver = stdout.substring(10+name.length,stdout.length-3)
                if(curr_ver>=ver) flag = true; else flag = false;             

                curr_ver_array=curr_ver
                ver_sat_array=flag

                console.log(curr_ver_array,ver_sat_array)
                
            })

        });
        
        var dataArray = [];
        var i=0;
        fs.createReadStream('dyte.csv')
        .pipe(csv())
        .on('data', function (data) {
            data.current_version = curr_ver_array;
            data.version_satisfied = ver_sat_array;
            dataArray.push(data);
            i++;
        })
        .on('end', function(){
            var json = dataArray
            var fields = Object.keys(json[0])
            var replacer = function(key, value) { return value === null ? '' : value } 
            var csv = json.map(function(row){
            return fields.map(function(fieldName){
                return JSON.stringify(row[fieldName], replacer)
            }).join(',')
            })
            csv.unshift(fields.join(',')) // add header column
            csv = csv.join('\r\n');
            // console.log(csv)
        //     var result = json2csv({ data: dataArray[0]});
            fs.writeFileSync("newDyte.csv", csv);
        });
    });

    fs.createReadStream('./dyte.csv').pipe(parser)

    exec("cat ./newDyte.csv | tty-table", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`${stdout}`);
    });

}

module.exports = verify