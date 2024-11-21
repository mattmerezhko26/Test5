const Sequelize = require('sequelize');
const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
const HTTP_POST = process.env.HTTP_POST || 4000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const sequelize = new Sequelize('neondb', 'neondb_owner', 'rb3gBLTkhH7W', {
  host: 'ep-old-credit-a5vvuqlk.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});
const Student = sequelize.define('Student', {
  student_id: {type: Sequelize.STRING,primaryKey: true, allowNull: false,},
  first_name: {type: Sequelize.STRING,allowNull: false, },
  last_name: {type: Sequelize.STRING,allowNull: false, },
  date_of_birth: {type: Sequelize.DATEONLY,  allowNull: false,  },
  email: {type: Sequelize.STRING,unique: true,  allowNull: false,  },
  enrollment_date: {type: Sequelize.DATEONLY,  allowNull: false,  },
  courses: {type: Sequelize.JSONB,  allowNull: true,},
});
sequelize.sync({ force: true }).then(() => {
  console.log('Students table has been created.');
});
app.post('/students',async(req,res) => {
  try{
    const {student_id,first_name,last_name,date_of_birth,email,enrollment_date,courses} = req.body;
    const student = await Student.create({student_id,first_name,last_name,date_of_birth,email,enrollment_date,courses});
    res.status(201).json(student);
  } catch (error){
    console.log("Error");
    res.status(400).json({message: `Problem with the student record`});
  }
});
app.get('/students',async (req,res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch(error){
    res.status(500).json({message: `Error message`});
  } 
});
app.get('/students/:student_id', async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { student_id: req.params.student_id },
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error with  students.' });
  }
});
app.put('/students/:student_id', async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, email, enrollment_date, courses } = req.body;
    const student = await Student.findOne({ where: { student_id: req.params.student_id } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    await student.update({first_name,last_name,date_of_birth,email,enrollment_date,courses});
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error wit students record.' });
  }
});
app.delete('/students/:student_id',async(req,res) =>{
  try {
    const student = await Student.findOne({where: {student_id:req.params.student_id},});
    if(!student){
      return res.status(404).json({message: 'Student not found'});
    }
    await student.destroy();
    res.status(200).json({ message: 'Student deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting student record.' });
  }
});
app.listen(HTTP_POST,()=> {
  console.log(`Server is running on ${HTTP_POST}`);
});