const http = require('http')
const path = require('path')
const commons = require('../src')

const caseCheckPort = () => {
  commons.net.checkIfPortIsReachable('index.hu', 80, 1000, err => console.log('host+ip error: ', err))
}

const caseCheckSocket = () => {
  const socketName = commons.platform.isLinux() ? '/tmp/testsocket1' : path.join('\\\\?\\pipe', 'valami');

  const server = http.createServer((req, res) => {
    res.write('Hello world!')
    res.end()
  }).listen(socketName) 

  setTimeout(() => {
    server.setTimeout(1000)
    server.close()
  }, 2000)

  commons.net.checkIfSocketIsReachable(socketName, 1000, err => console.log('socket error: ', err))
}

caseCheckSocket()
caseCheckPort()

