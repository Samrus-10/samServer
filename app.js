const Express = require('express');
const fs = require('fs');
const parser = require('body-parser');

//настраиваем Express
const app = Express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/modul_html/views');

//настраиваем парсер
const urlParser = parser.urlencoded({ extended: false });

//глобальные переменные
let id = 0;
let email = '';

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

    name: {
        type: BD.STRING,
        allowNull: false
    },
    age: {
        type: BD.INTEGER,
        allowNull: false
    }
});

const client = bd.define('client', {
    id: {
        type: BD.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: BD.STRING,
        allowNull: false
    },
    password: {
        type: BD.STRING,
        allowNull: false
    }
});
client.hasMany(person, { onDelete: 'cascade' });

//работа с сервером 
app.get('/', (req, res) => {

    res.sendFile(__dirname + '/modul_html/enter.html');
});

app.post('/', urlParser, (req, res) => {

    //поиск по where
    client.findAll({
            where: {
                email: req.body.email,
                password: req.body.password
            },
            raw: true
        })
        .then(user => {
            console.log(user);
            if (user[0]) {
                email = user[0].email;
                id = user[0].id;
                res.redirect('/main');
                console.log('right');
            } else {
                res.sendFile(__dirname + '/modul_html/wrong_enter.html');
                console.log('wrong');
            }
        })
        .catch(error => {
            console.log(error);
        });

});

app.get('/register', (req, res) => {


    res.sendFile(__dirname + '/modul_html/register.html');
});

app.get('/wrongregister', (req, res) => {


    res.sendFile(__dirname + '/modul_html/wrong_register.html');
});

app.get('/main', (req, res) => {

    //синхронизация с БД 
    // bd.sync()
    //     .then(result => console.log('Conation to BD is seccess!'))
    //     .catch(err => console.log(err));


    res.sendFile(__dirname + '/modul_html/main.html');

});
//личный кабинет 
app.get('/place', (req, res) => {

    res.render('Your_place.hbs', {
        email: email
    });
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
    person.findAll({
            where: {
                clientId: id
            },
            raw: true
        })
        .then(user => {

            res.render('show.hbs', {
                title: 'AllPerson',
                human: user
            });
        });


});

app.get('/add', (req, res) => {

    res.sendFile(__dirname + '/modul_html/add.html');
});

app.post('/add', urlParser, (req, res) => {


    person.create({
            name: req.body.name,
            age: req.body.age,
            clientId: id
        })
        //.then(() => console.log('data is put in BD'))
        .catch((error) => console.log(error));
    res.redirect('/main');

});

//добавление нового пользователя
app.post('/newclient', urlParser, (req, res) => {

    if (req.body.password === req.body.password1) {
        client.create({
                email: req.body.email,
                password: req.body.password
            })
            .catch((error) => console.log(error));
        res.redirect('/main');
    } else {
        //req.body.password1 = 'wrong repeat passwort';
        res.redirect('/wrongregister');
    }


});
app.listen(3000);