const fs = require('fs')

let raw = require(__dirname + '/src/js/redirects.json')
let transformed = raw.map((r) => {
    return {
        to: r.to,
        from: r.from,
        permanent: r.permanent
    }
})

fs.writeFileSync(__dirname + '/redirects.json', JSON.stringify(transformed))