const fileStorage = require('../utils/fileStorage.js')


async function getAllExperiences(req,res){
    const data = await fileStorage.readExperiences();
    res.json(data)
}


async function createExperience(req,res){
   const data = await fileStorage.readExperiences();
   const { company, role, difficulty, questions } = req.body

   const newexperience = {
    id: Date.now().toString(),
    company: company,
    role: role,
    difficulty: difficulty,
    questions: questions
   }
   data.push(newexperience);
   
   await fileStorage.saveExperiences(data)

  res.status(201).json({ success: true, data: newexperience })
}




async function updateExperience(req, res) {
  const data = await fileStorage.readExperiences()

  const { id } = req.params

  const index = data.findIndex(e => e.id === id)
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Experience not found' })
  }

  data[index] = { ...data[index], ...req.body } // keep old fields, overwrite with new ones

  await fileStorage.saveExperiences(data)
  res.json({ success: true, data: data[index] })
}



async function deleteExperience(req, res) {
  const data = await fileStorage.readExperiences()

  const { id } = req.params

  const index = data.findIndex(e => e.id === id)
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Experience not found' })
  }

  const deleted = data[index]      // save it before removing
  data.splice(index, 1)

  await fileStorage.saveExperiences(data)
  res.json({ success: true, data: deleted })
}



module.exports = {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience
}