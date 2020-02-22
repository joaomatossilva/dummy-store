const fs = require('fs')

const search = (q) => {
    return new Promise(async (resolve, reject) => {
        var data = await loadData()
        resolve(data)
    })
}

const category = (category) => {
    return new Promise(async (resolve, reject) => {
        var data = await loadData()
        resolve(data.filter(item => item.category === category))
    })
}

const get = (ids) => {
    return new Promise(async (resolve, reject) => {
        var data = await loadData()
        const items = ids.map((id) => {
            return data.find((item) => item.id == id)
        })
        resolve(items)
    })
}

const loadData = () => new Promise((resolve, reject) => {
    fs.readFile('data.json', (err, data) => {
        if(err){
            return reject(err)
        }

        resolve(JSON.parse(data.toString()))
    })
})

module.exports = {
    search,
    category,
    get
}