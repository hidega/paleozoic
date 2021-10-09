'use strict'

const assert = require('assert')
const net = require('net')

const socketPath = '/var/tmp/node-ipc-socket-' + Math.floor(Math.random()*1000000)

const server = net.createServer(conn => {
  let receivedData = Buffer.from([])

  conn.on('error', err => {
    console.error(err)
    assert(false)
  })

  conn.on('data', data => {
    receivedData = Buffer.concat([receivedData, data])
    if(receivedData[0]===1 && receivedData.length===10*1000*1000) {
      conn.write(Buffer.from('Hello World!'), () => conn.end())
    }
  })

  conn.on('end', () => {
    if(receivedData[0]===1) {
      console.log(1)
      assert(receivedData.length===10*1000*1000)
      receivedData.forEach(b => assert(b===1))
    } else if(receivedData[0]===2) {
      console.log(2)
      assert(receivedData.length===2*1000*1000)
      receivedData.forEach(b => assert(b===2))
      conn.end()
    } else if(receivedData[0]===3) {
      console.log(3)
      assert(receivedData.length===3*1000*1000)
      receivedData.forEach(b => assert(b===3))
      conn.end()
    } else {
      conn.end()
      assert(false)
    }
  })
})

server.on('error', err => {
  console.error(err)
  assert(false)
})

setTimeout(() => server.close(), 5000)

server.listen(socketPath, () => console.log('Server is listening'))

setImmediate(() => {
  const socket1 = net.createConnection(socketPath, () => {
    console.log('socket #1 is ready')
    socket1.write(Buffer.alloc(10*1000*1000, 1), err => {
      console.log(err)
      assert(!err)
    })
  })
  socket1.on('error', err => {
    console.error(err)
    assert(!err)
  })
  socket1.on('data', data => {
    console.log(data.toString())
    assert(data.toString()==='Hello World!')
    socket1.end()
    console.log('socket #1 is closed')
  })
})

setImmediate(() => {
  const socket2 = net.createConnection(socketPath, () => {
    console.log('socket #2 is ready')
    socket2.write(Buffer.alloc(2*1000*1000, 2), err => {
      console.log(err)
      assert(!err)
      socket2.end()
      console.log('socket #2 is closed')
    })
  })
  socket2.on('error', err => {
    console.error(err)
    assert(!err)
  })
})

setImmediate(() => {
  const socket3 = net.createConnection(socketPath, () => {
    console.log('socket #3 is ready')
    socket3.write(Buffer.alloc(3*1000*1000, 3), err => {
      console.log(err)
      assert(!err)
      socket3.end()
      console.log('socket #3 is closed')
    })
  })
  socket3.on('error', err => {
    console.error(err)
    assert(!err)
  })
})
