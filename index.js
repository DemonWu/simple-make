#!/usr/bin/env node
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import FileUtils from "./utils/FileUtils";

yargs(hideBin(process.argv))
    .command('template [action]', '模板处理', (yargs) => {
    return yargs.positional('action', {
            type: 'string',
            choices: ['list', 'get', 'check', 'copy', 'create', 'author'],
            describe: '模板相关操作',
            default: 'list'
        })
}, (argv => {
    if (argv.verbose) {
        console.info(`template action: ${argv.action}`);
    }
    if (argv.action === 'list') {
        console.log(FileUtils.getTemplates().join('\r\n'));
    } else if (argv.action === 'get') {
        if (argv.templateName) {
            console.log(FileUtils.getTemplate(argv.templateName).join('\r\n'));
        } else {
            console.error('需要填写模板名称');
        }
    } else if (argv.action === 'check') {
        // 检查模板
        FileUtils.chooseTemplate(argv.templateName);
    } else if (argv.action === 'copy') {
        // 复制模板
        if (argv.templateName && argv.name) {
            FileUtils.copy(argv.templateName, argv.name, argv.description, argv.dir);
        }
    } else if(argv.action === 'create') {
        FileUtils.chooseTemplate();
    } else if (argv.action === 'author') {
        FileUtils.author();
    }
})).option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: '是否开启log'
}).option('templateName', {
    alias: 'tn',
    type: 'string',
    description: '模板名称',
}).option('dir', {
    alias: 'd',
    type: 'boolean',
    description: '是否是文件夹形式',
}).option('name', {
    alias: 'n',
    type: 'string',
    description: '创建名称',
}).option('description', {
    alias: 'desc',
    type: 'string',
    description: '描述',
}).argv;
