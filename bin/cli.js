#!/usr/bin/env node


const meow = require('meow');
const { generate } = require('../src/index');

const helpMessage = `
🐼️ .- hello friend, here's what I have. Thanks to use soldoc.

Usage
    $ soldoc [options] <output-folder> <file(s)>

Options
    --help, -h  To get help
    --output -o The output type [html/pdf/gitbook/docsify] default: html
    --ignore -i An array of files to ignore

Examples
    $ soldoc docs/ contracts/Sample.sol
    $ soldoc docs/ contracts/
    $ soldoc --output pdf docs/ Sample.sol
    $ soldoc --output gitbook --ignore Migrations.sol docs/ Sample.sol
`;
const cli = meow(helpMessage, {
    flags: {
        output: {
            type: 'string',
            alias: 'o',
            default: 'html',
        },
        ignore: {
            type: 'string',
            alias: 'i',
        },
    },
});

function main() {
    if (cli.input.length !== 2) {
        console.error(
            'You must be doing something wrong. There\'s a 🐼️ available to help you, '
            + 'just write \'soldoc --help\'.\r\n\r\n\t🐼 ️🐼️ are really cool! Aren\'t they?',
        );
        return 1;
    }

    // pdf generation is a bit slower
    if (cli.flags.output === 'pdf') {
        console.log('Wait...might take a moment! 🐼️ is doing is stuff...');
    }
    let ignoreList = [];
    if (cli.flags.ignore && cli.flags.ignore.length > 0) {
        const commaPosition = cli.flags.ignore.indexOf(',');
        if (commaPosition >= -1) {
            ignoreList = cli.flags.ignore.split(',');
        }
    }
    return generate(cli.flags.output, ignoreList, String(cli.input[0]), String(cli.input[1]));
}

main();
