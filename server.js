const http = require('http')
const fs = require('fs')
const os = require('os')

const PORT = 3000;
const localhost = '127.0.0.1';
let statusCode = null;
let osInfo = JSON.stringify({
    "hostname": os.hostname(),
    "platform": os.platform(),
    "architecture": os.arch(),
    "numberOfCPUS": os.cpus().length,
    "networkInterfaces": os.networkInterfaces(),
    "uptime": os.uptime()
});

const server = http.createServer((req, res) => {
    //switch statement to set page to return to user depending on request url
    let path = "./pages";
    switch (req.url) {
        case "/":
            path += "/index.html"
            statusCode = 200;
            break;
        case "/about":
            path += "/about.html"
            statusCode = 200;
            break;
        case "/sys":
            path = 'sys';
            statusCode = 201;
            break;
        default:
            path += "/404.html"
            statusCode = 404;
            break;
    }

    //function to set header and status code
    function setHttpParams(header, returnStatusCode) {
        res.setHeader('Content-Type', header);
        res.statusCode = returnStatusCode;
    }

    //returning page to user depending on path chosen
    if (path == 'sys') {
        setHttpParams('text/plain', statusCode);
        fs.writeFile("./osInfo.json", osInfo, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.end("Your OS info has been saved successfully!");
            }
        })
    } else {
        setHttpParams('text/html', statusCode)
        fs.readFile(path, (error, data) => {
            if (error) {
                console.log(error)
            } else {
                res.end(data);
            }
        })
    }
})

server.listen(PORT, localhost, () => {
    console.log(`server is listening at http://${localhost}:${PORT}`)
})


