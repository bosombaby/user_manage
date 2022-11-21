const mysql = require('mysql')

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database:'3d_resources'
    
})

let query = (sql, values)=> {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject('数据库连接出错',err)
            } else {
                connection.query(sql, values, (err, results) => {
                    if (err) {
                        reject('数据库语句出错',err)
                    } else {
                        resolve(results)
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports=query