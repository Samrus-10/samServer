const Express = require('express');
const fs = require('fs');
const parser = require('body-parser');

//настраиваем Express
const app = Express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/modul_html/views');

//bd conect
const BD = require('sequelize');
const bd = new BD("sam", "sam", "sr271018", {
    dialect: "postgres",
    host: "localhost",
    define: {
        timestamps: false
    }
});
//создаю модель для БД 
const person = bd.define('person', {

    id: {
        type: BD.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: BD.STRING,
        allowNull: false
    },
    age: {
        type: BD.INTEGER,
        allowNull: false
    }
});

//настраиваем парсер
const urlParser = parser.urlencoded({ extended: false });

app.get('/', (req, res) => {

    //синхронизация с БД 
    // bd.sync()
    //     .then(result => console.log('Conation to BD is seccess!'))
    //     .catch(err => console.log(err));


    res.sendFile(__dirname + '/modul_html/main.html');

});

app.use('/delete', (req, res) => {

    //удаление данных из БД 
    person.destroy({
        where: {
            name: req.query.name,
            age: req.query.age
        }
    });

    console.log(req.query.name + req.query.age);
    res.redirect('/show');
});

app.get('/show', (req, res) => {

    //вывести все данные из БД
    person.findAll({ raw: true })
        .then(user => {

            res.render('show.hbs', {
                title: 'AllPerson',
                human: user
            });
        });

    // setTimeout(() => {
    //     res.render('show.hbs', {
    //         title: 'AllPerson',
    //         human: users
    //     })
    // }, 0);
});

app.get('/add', (req, res) => {

    res.sendFile(__dirname + '/modul_html/add.html');
});

app.post('/add', urlParser, (req, res) => {

    console.log(req.body);
    person.create({
            name: req.body.name,
            age: req.body.age
        })
        .then(() => console.log('data is put in BD'))
        .catch((error) => console.log(error));
    res.redirect('/');

});
app.listen(3000);