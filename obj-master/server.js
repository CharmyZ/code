
const express = require('express')
const app     = express()

//file server
app.use('/src', express.static('src'))
app.use('/build', express.static('build'))

//view
app.get('/',function (req,res) {
    res.sendfile('index.html')
})

//api
app.get('/api',function (req,res) {
    var returnData = {
        code:10000,
        data:[],
        msg:'请求成功'
    }
    for(let i=0;i<rand(20,50);i++){
        returnData.data.push({
            num:rand(10000,999999)
        })
    }
    res.json(returnData)
})

function rand(min,max) {
    return Math.floor(Math.random() * (max+1 - min) + min)
}

app.listen(1234);