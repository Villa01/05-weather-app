
const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you want to do?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Search City`
            },
            {
                value: 2,
                name: `${'2.'.green} History`
            },
            {
                value: 0,
                name: `${'0.'.green} Exit\n`
            }
        ]
    }
]

const inquirerMenu = async () => {
    console.clear();
    console.log('==============================='.green);
    console.log('       Select an option: '.white);
    console.log('===============================\n'.green);

    const {option} = await inquirer.prompt(questions);
    return option;
}

const pause = async () => {

    console.log('\n');
    await inquirer.prompt({
        type: 'input',
        name: 'enter',
        message: `Press ${'ENTER'.green} to continue...`
    });
}

const readInput = async( message ) => {
    const question = [
        {
            type:'input',
            name:'desc',
            message,
            validate( value ) {
                if ( value.length === 0) {
                    return 'Please, enter a value';
                }
                return true;
            }
        }
    ]
    
    const { desc } = await inquirer.prompt(question);
    return desc
}

const listPlaces = async(places = []) => {
    const choices = places.map( ({id, name}, i) => {
        const index = `${i+1}.`.green;
        return {
            value: id,
            name: `${index} ${name}`
        }
    });

    choices.unshift({
        value: 0,
        name: '0.'.green + ' return'
    })

    const questions = [
        {
            type:'list',
            name: 'id',
            message: 'Select a place',
            choices
        }
    ]

    const {id} = await inquirer.prompt(questions);
    return id;
}

const completeCheckList = async(toDos = []) => {
    const choices = toDos.map( ({id, desc, completedIn}, i) => {
        const index = `${i+1}.`.green;
        return {
            value: id,
            name: `${index} ${desc}`,
            checked: ( completedIn ) ? true: false
        }
    });

    const questions = [
        {
            type:'checkbox',
            name: 'ids',
            message: 'Select ',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(questions);
    return ids;
}

const confirm = async( message ) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const { ok } = await inquirer.prompt(question);
    return ok;
}

module.exports = {
    completeCheckList,
    confirm,
    inquirerMenu, 
    listPlaces,
    pause,
    readInput,
}