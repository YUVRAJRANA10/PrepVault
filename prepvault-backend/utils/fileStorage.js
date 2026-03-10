const fs = require('fs/promises')
const path = require('path')

const DATA_FILE = path.join(__dirname,'../data/experiences.json')

async function readExperiences() {

    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const experiences = JSON.parse(data);
    return experiences;
    
}

async function saveExperiences(data) {
    const json = JSON.stringify(data, null, 2)
    await fs.writeFile(DATA_FILE, json)
}

module.exports = {readExperiences,saveExperiences}