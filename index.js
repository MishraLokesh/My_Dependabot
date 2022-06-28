#! /usr/bin/env node
const chalk = require('chalk')
const figlet = require('figlet')
const { program } = require('commander')
const list = require('./commands/list')
const add = require('./commands/add')
const verify = require('./commands/verify')
const pull_req = require('./commands/pull_req')

// console.clear();

console.log(
  chalk.yellow(
    figlet.textSync('SDK_TOOL', { horizontalLayout: 'full' })
  )
);

program
    .command('list <csv_name>')
    .description('List all the contents of the csv file')
    .option('-i', 'To input the csv file')
    .action(list)

program
    .command('add')
    .description('Add a new github repo to the existing csv file')
    .action(add)

program
    .command('verify <name_ver>')
    .description('To verify and compare the version numbers')
    .action(verify)

program
    .command('pull_req <name_ver>')
    .description('Update repo and create a pull request')
    .option('-update, -u', 'To update and generate a pull request for repositories below the desired version')
    .action(pull_req)

program.parse()

