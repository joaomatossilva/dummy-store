const path = require('path')
const express = require('express')
const hbs = require('hbs')
const session = require('express-session')
const bodyParser = require('body-parser')
const store = require('./store.js')

const app = express()
const port = process.env.PORT || 3000

//view engine
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
hbs.localsAsTemplateData(app);

//serve public path folder
const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))

//session
app.use(session({
    secret: 'some very secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//middleware to set the countInCart available on all pages
app.use('', (req, res, next) => {
    const idsInCart = req.session.idsInCart || []
    res.locals.countInCart = idsInCart.length
    next()
})

//home
app.get('', (req, res) => {
    
    res.render('index')
})

app.get('/details/:id', async (req, res) => {
    const {id} = req.params
    var item = await store.get([id])
    res.render('details', item[0])
})

app.get('/category/:categoryName', async (req, res) => {
    const {categoryName} = req.params
    var items = await store.category(categoryName)
    res.render('search', {
        data: items
    })
})

app.get('/search', async (req, res) => {
    const { q } = req.query

    var items = await store.search(q)

    res.render('search', {
        searchString: q,
        data: items
    })
})

app.get('/cart', async (req, res) => {
    const idsInCart = req.session.idsInCart || []
    var items = await store.get(idsInCart)

    res.render('cart', {
        data: items
    })
})

app.post('/cart', (req, res) => {
    const { id } = req.body
    const idsInCart = req.session.idsInCart || []
    idsInCart.push(id)
    req.session.idsInCart = idsInCart
    res.redirect('/cart')
})

app.post('/thank-you', async (req, res) => {
    const idsInCart = req.session.idsInCart || []
    req.session.idsInCart = []
    res.locals.countInCart = 0

    var items = await store.get(idsInCart)
    res.render('thank-you', {
        data: items
    })
})


app.listen(port, () => {
    console.log('server running on port ' + port)
})