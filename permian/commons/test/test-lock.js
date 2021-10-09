'use strict'

const { fork } = require('child_process')

const childProcessA = fork('./lock-on-file', [], { detached: true })
childProcessA.on('message', console.log)

const childProcessB = fork('./lock-on-file', [], { detached: true })
childProcessB.on('message', console.log)

setTimeout(() => {}, 2000)
