const fs = require('fs');
const path = require('path');
const toPdf = require('pdf-from-html');
const emoji = require('node-emoji');
const {
    transformTemplate,
} = require('./renderHTML');
const {
    organizeContractsStructure,
} = require('./organize');


const defaultTemplatePath = 'src/template/pdf/index.html';

/**
 * @param contractsPreparedData prepared data
 */
exports.generateDocumentation = (contractsPreparedData, outputFolder) => {
    // create a list of contracts and methods
    const contractsStructure = organizeContractsStructure(contractsPreparedData);
    const hasLICENSE = fs.existsSync(path.join(process.cwd(), 'LICENSE'));
    contractsPreparedData.forEach(async (contract) => {
        // transform the template
        let HTMLContent = transformTemplate(
            path.join(contract.currentFolder, defaultTemplatePath),
            contract.contractName,
            contract.contractData,
            contract.solidityFilePath,
            contractsStructure,
            hasLICENSE,
        );
        // transform damn weird URLS into real liks
        const match = HTMLContent.match(/(?<!\[)https?:&#x2F;&#x2F;[a-zA-Z0-9.&#x2F;\-_]+/g);
        if (match !== null) {
            let transform = match.map(url => url.replace(/&#x2F;/g, '/'));
            transform = transform.map(url => `<a href="${url}">${url}</a>`);
            for (let i = 0; i < match.length; i += 1) {
                HTMLContent = HTMLContent.replace(match[i], transform[i]);
            }
        }
        const formatEmojify = (code, name) => `<i alt="${code}" class="twa twa-${name}"></i>`;
        // generate
        await toPdf.generatePDF(
            outputFolder,
            contract.filename,
            emoji.emojify(HTMLContent, null, formatEmojify),
        );
    });
};
