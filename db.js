const uri = require("./mongo_uri")
let mongoose = require('mongoose');

// Define the Person Schema
const PersonSchema = new mongoose.Schema({
    name : {type: String, required: true},
    age : {type: Number}, 
    favoriteFoods : {type:[String], required: true, default: []}
})

// Connect to MongoDB
mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("MongoDB connected"))
.catch((err) => console.log("Error : ", err))

const Person = mongoose.model('Person', PersonSchema)

const main = async () => {
    try{

        // create and save a record
        const pers = new Person({ name : 'Alice', age: 56, favoriteFoods : ['fvrtFoodNum1', 'fvrtFoodNum2']})
        const savedPers = await pers.save()
        console.log("Document saved: ", savedPers)
        
        // Create many records
        const people = [
            {name: 'Ayman', age: 22, favoriteFoods : ['fvrtFood1', 'fvrtFood2', 'burritos']},
            {name: 'Leila', age: 32, favoriteFoods : ['fvrtFood1', 'fvrtFood12']},
            {name: 'Saad', age: 42, favoriteFoods : ['fvrtFood21', 'burritos', 'fvrtFood1']},
            {name: 'Sara', age: 52, favoriteFoods : ['fvrtFood21', 'burritos', 'fvrtFood23']},
            {name: 'Ahmed', age: 62, favoriteFoods : ['fvrtFood21', 'burritos', 'fvrtFood1', 'fvrtFood23']},
        ]
        
        const createdPeople = await Person.create(people)
        console.log('People Created successfully : ', createdPeople)
            
        
        // Find all people having a given name
        const p1 = await Person.find({name:'Hafsa'})
        console.log("i found the person called hafsa : ", p1)
        

        // looking for person which has a certain food in the person's favorites
        const p2 = await Person.findOne({favoriteFoods : 'fvrtFood1' })
        console.log("i found the person's favorite food 1  : ", p2)
        

        // looking for a person using the _id
        const personById = await Person.findById('67a014785f4123ed3bcfbb0b')
        console.log("i found the person with this id: ", personById)

        // find and update a person
        const personToUpdate =  await Person.findById('67a014b26613e5d38cd31c8b')
        if(personToUpdate){
            console.log("found document to update : ", personToUpdate)
            personToUpdate.name = 'Samia';
            personToUpdate.favoriteFoods.push("hamburger");
            personToUpdate.save()
        }
        else{
            console.log("No document found.")
        }
        
        // show all people
        const allPeople = await Person.find()
        console.log("all people : ", allPeople)

        // find and update the age of a person
        const personToUpdtAge = await Person.findOneAndUpdate({name: 'Ahlam'}, {age: 20}, {new: true})
        console.log("document updated:", personToUpdtAge)

        // delete a person
        const personToDelete = await Person.findByIdAndDelete('67a014785f4123ed3bcfbb0c')
        if(personToDelete){
            console.log("Removed person", personToDelete)
        }
        else{ console.log("No person with this ID")}

        // remove all people called "Mary"
        const removeMary = await Person.deleteMany({name:'Mary'})
        if(removeMary.deletedCount > 0) console.log("deleted person : ", removeMary)
        else console.log("No person with this name")

        // Chain Search
        const peoplelikeBurritos = await Person.find({favoriteFoods: 'burritos'})
                .sort({name: 1})
                .limit(2)
                .select({age: false})
                .exec()
        console.log("people who likes burritos :", peoplelikeBurritos)

    } catch(err) {
        console.log("Error: ", err)
    } finally {
        await mongoose.connection.close()
    }
}

main()

