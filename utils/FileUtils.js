import fs from "fs";
import path from 'path';
import dayjs from "dayjs";
import inquirer from "inquirer";
import shell from 'shelljs';
import chalk from 'chalk';
import config from '@/json/config.json';

const logSuccess = (str) => {
    console.log(chalk.cyan(str));
}

export default class FileUtils {
    static getTemplates(){
        // 获取文件夹的信息
        const dirs = fs.readdirSync(path.resolve(__dirname, './template'));
        return dirs;
    }
    static getTemplate(template) {
        // 获取模板内容
        const files = fs.readdirSync(path.resolve(__dirname, './template/' + template));
        return files;
    }
    // 以模板创建
    static copy(template, name, description, isDir) {
        const files = fs.readdirSync(path.resolve(__dirname, './template/' + template));
        const path1 = process.cwd() + isDir ? name : '';
        if (isDir) {
            if (!fs.existsSync(path1)) {
                fs.mkdirSync(path1);
            }
        }
        for (let i = 0; i < files.length; ++ i) {
            const fileName = files[i];
            const filePath = path.resolve(path1, isDir ? fileName : (fileName.replace('index', name)));
            const fileContent = fs.readFileSync(path.resolve(__dirname, `./template/${template}/${fileName}`), {encoding: 'utf-8'});
            fs.writeFileSync(filePath,
                fileContent.replace(/@name/g, name)
                    .replace(/@date/g, dayjs().format('YYYY-MM-DD HH:mm:ss'))
                    .replace(/@author/g, config.author)
                    .replace(/@description/g, description || ''),
                {
                    flag: ''
                }
            );
        }
        logSuccess('创建成功');
    }
    // 选择模板
    static async chooseTemplate(templateName) {
        // 选择某个模板进行查看，进入模板后会让选择操作
        // 操作: 1、查看文件，2、创建文件，3、删除文件，4、退出
        // 查看文件进入后选择打开文件内容
        // 当前step
        let step = '';
        if (!templateName) {
            do {
                const answers = await inquirer.prompt([{
                    type: 'input',
                    name: 'templateName',
                    message: '请输入模板名称'
                }])
                if (answers['templateName']) {
                    const dirPath = path.resolve(__dirname, `./template/${answers['templateName']}`)
                    const isExit = fs.existsSync(dirPath);
                    if (isExit) {
                        const {isConfirm} = await inquirer.prompt([{
                            type: 'confirm',
                            name: 'isConfirm',
                            message: '已存在模板是否进入模板？'
                        }])
                        if (isConfirm) {
                            templateName = answers['templateName'];
                        }
                    } else {
                        // 创建文件夹
                        fs.mkdirSync(dirPath);
                        templateName = answers['templateName'];
                    }
                }
            } while (!templateName);
        }
        while (step !== '退出') {
            if (!step) {
                const answers = await inquirer.prompt([{
                    type: 'rawlist',
                    name: 'step',
                    message: '请选择需要执行的操作',
                    choices: ['查看文件', '创建文件', '删除文件', '退出'],
                }]);
                step = answers['step'];
            } else if(step === '查看文件') {
                const { fileName } = await inquirer.prompt([{
                    type: 'list',
                    name: 'fileName',
                    message: '请选择文件',
                    choices: [...FileUtils.getTemplate(templateName), '退出'],
                    pageSize: 4,
                    loop: true,
                }]);
                if (fileName) {
                    if (fileName === '退出') {
                        step = '';
                    } else {
                        const filePath = path.resolve(__dirname, `./template/${templateName}/${fileName}`);
                        const content = fs.readFileSync(filePath, {encoding: "utf8"});
                        const {changeContent} = await inquirer.prompt([{
                            type: 'editor',
                            name: 'changeContent',
                            message: '查看文件并且修改',
                            default: content,
                        }]);
                        fs.writeFileSync(filePath, changeContent);
                        logSuccess('修改完成')
                    }
                }
            } else if (step === '创建文件') {
                const {name} = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: '请输入创建文件名称',
                    }
                ]);
                // 检测文件是否存在
                const filePath = path.resolve(__dirname, `./template/${templateName}/${name}`);
                if (!fs.existsSync(filePath)) {
                    shell.touch(filePath);
                }
                // 如果文件存在则直接进入文件
                const {content} = await inquirer.prompt([
                    {
                        type: 'editor',
                        name: 'content',
                        message: '请输入文件内容',
                    }
                ])
                fs.writeFileSync(filePath, content);
                logSuccess('创建成功');
                step = '';
            } else if (step === '删除文件') {
                const { fileName } = await inquirer.prompt([{
                    type: 'list',
                    name: 'fileName',
                    message: '请选择文件',
                    choices: [...FileUtils.getTemplate(templateName), '退出'],
                    pageSize: 4,
                    loop: true,
                }]);
                if (fileName) {
                    if (fileName === '退出') {
                        step = '';
                    } else {
                        const {isConfirm} = await inquirer.prompt([{
                            type: 'confirm',
                            name: 'isConfirm',
                            message: '确认删除？',
                        }]);
                        if (isConfirm) {
                            const filePath = path.resolve(__dirname, `./template/${templateName}/${fileName}`);
                            shell.rm(filePath);
                            logSuccess('删除成功');
                        }
                    }
                }
            }
        }
    }
    // 修改author
    static async author(){
        const {author} = await inquirer.prompt([{
            type: 'input',
            name: 'author',
            message: '请确认作者',
            default: config.author,
        }]);
        const jsonPath = path.resolve(__dirname, './json/config.json');
        config.author = author;
        fs.writeFileSync(jsonPath, JSON.stringify(config,null,"\t"));
        logSuccess('修改成功');

    }
}
