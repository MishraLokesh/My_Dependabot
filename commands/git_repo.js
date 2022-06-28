require('dotenv').config()
var fs   = require('fs')
var csv = require('csv-parser');
var {parse} = require('csv-parse');
var json2csv = require('json2csv').parse;
var stringify = require('csv-stringify');


const { Octokit } = require("@octokit/core");
const { link } = require('fs/promises');
const octokit = new Octokit({
  auth: process.env.TOKEN
})

async function git_repo(owner, repo, message){
  // Forking the repository
  await octokit.request('POST /repos/{owner}/{repo}/forks', {
    owner: owner,
    repo: repo
  })
  
  file = "./pkg/new_package.json",
  data = fs.readFileSync(file);
  cont = data.toString('base64');

  // Updating the package.json file
  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'MishraLokesh',
    repo: repo,
    path: 'new_package.json',
    message: 'updating package.json file with newer version',
    committer: {
      name: 'Lokesh Mishra',
      email: '4man.mishra@gmail.com'
    },
    content: cont
  })

  // Generating a pull request for the repository
  await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    owner: owner,
    repo: repo,
    title: message,
    body: 'Please pull these changes in to update with the latest version!',
    head: 'MishraLokesh:main',
    base: 'main'
  })
  // console.log(owner, repo)
}

module.exports = git_repo
