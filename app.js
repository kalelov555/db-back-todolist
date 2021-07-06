const express = require('express')
const bodyParser = require('body-parser')
//const calendar = require(__dirname + "/date.js")
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"))

mongoose.connect('mongodb+srv://admin-saga:test123@cluster0.nubbd.mongodb.net/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = new mongoose.Schema ({
    name: String
});

const Item = mongoose.model('Item', itemsSchema);


const listSchema = new mongoose.Schema ({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);



const i1 = new Item ({
    name: "Make zaryadka"
});
const i2 = new Item ({
    name: "Have breakfast"
});
const i3 = new Item ({
    name: "Calisma"
});

const defaultItems = [i1, i2, i3];







app.get('/', function(req , res) {
    //const date = calendar.getDate();
    
    
    Item.find(function(err, items) {
        if(items.length===0) {
            Item.insertMany(defaultItems, function(err) {
                if(err) console.log(err);
                else console.log("Successfully inserted default items to DB");
            })

        res.redirect('/');
        } else
        res.render('list', {listItem: "Today", newListItems: items});
    });
})
    

app.post('/', function(req, res) {
    const iName = req.body.newTodo;
    const listName = req.body.list;

    const item = new Item ({
        name: iName
    });

    if(listName === "Today") {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        });
    }
   
});


app.post("/delete", function(req, res) {
    const deleteID = req.body.checkbox;
    const listName = req.body.listName[0];

    if(listName === "Today") {
    Item.findByIdAndRemove(deleteID, function(err) {
        if(!err) {
            console.log("successfully deleted checked box");
            res.redirect('/');
        }
    });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteID}}}, function(err, foundList) {
            if(!err) {
                res.redirect('/' + foundList.name)
            }
        })
    }
})


app.get('/:category', function(req, res) {
    const customListName = _.capitalize(req.params.category); 
    
    List.findOne({name: customListName}, function(err, result) {
        if(!err) {
            if(!result) {
                const list = new List ({
                name: customListName,
                items: defaultItems
                });

            list.save();

            res.redirect('/' + customListName);

            }
            else {
                res.render('list', {listItem: result.name, newListItems: result.items});
            }
        }
    })

    

    
});



app.get('/about', function(req, res) {
    res.render('about')
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server has started successfully");
})