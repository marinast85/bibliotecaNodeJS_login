const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const db = 'mongodb+srv://marina_toledo:marina_toledo@cluster0.ae6hs.mongodb.net/libary?retryWrites=true&w=majority';


app.set('view engine', 'ejs');
app.set('views', __dirname, 'views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

const livros = mongoose.model('livros', {
    titulo: String,
    genero: String,
    autor: String
})

var is_adm = 0;

app.get('/', (req, res) => {
    console.log(is_adm)
    res.render('login');
    var nome_login = req.query.nome;
    var senha_login = req.query.senha;
    var cod_login = req.query.cod;
    if (nome_login == 'admin' && cod_login == 123456 && senha_login == 'admin') {
        is_adm = 'adm';
    } else {
        is_adm = 'user';
    }
})

app.get('/novolivro', (req, res) => {
    res.render('formlivro');
})

app.get('/livros', (req, res) => {
    var consulta = livros.find({}, (err, objetoProcurado) => {
        if (err) {
            return res.status(500).send('Erro ao procurar.');
        }
        res.render('livros', { objetoImprimir: objetoProcurado });
    })
})

app.post('/novolivro', (req, res) => {
    var livro = new livros();
    livro.titulo = req.body.titulo;
    livro.genero = req.body.genero;
    livro.autor = req.body.autor;
    livro.save((err) => {
        if (err) {
            return res.status(500).send('Erro ao cadastrar aluno.');
        }
        return res.redirect('/livros');
    })
});

app.get('/editarlivro/:id', (req, res)=>{
    livros.findById(req.params.id,(err, livroEncontrado)=>{
        if(err){
            return res.status(500).send('Erro ao editar');
        };
        res.render('formeditar', {livroParaEditar: livroEncontrado});
    });
});

app.post('/editarlivro', (req, res)=>{
    livros.findById(req.body.id, (err, livro) =>{
        if(err){
            return res.status(500).send('Erro ao editar');
        };
        livro.titulo = req.body.titulo;
        livro.genero = req.body.genero;
        livro.autor = req.body.autor;

        livro.save(err =>{
            if(err){
                return res.status(500).send('Erro ao salvar edição');
            }
            res.redirect('/livros');
        })
    });
});

app.get('/deletarlivro/:id', (req, res) =>{
    if(is_adm =='user'){
        res.redirect('/');
    }else if(is_adm =='adm'){

    var chave = req.params.id;
    livros.deleteOne({_id:chave}, (err, result) =>{
        if(err){
            return req.status(500).send('Erro ao deletar o livro');
        }
        res.redirect('/livros');
    })};
});




app.listen(port, () => {
    console.log(`Server is now running. PORT: ${port}`);
})
