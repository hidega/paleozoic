var os = require('os')
var fs = require('fs')
var { execSync } = require('child_process')

var pf = os.platform().toLowerCase()

var isLinux = () => pf === 'linux'

var isWindows = () => pf === 'win32' || pf === 'win64'

var getId = (name, d) => {
  var result = false;
  if (isLinux()) {
    result = execSync(`id -${d} ` + name)
  } else if (isWindows()) {
    throw new Error('Not implemented')
  } else {
    throw new Error('Not implemented')
  }
  return result.toString().trim()
}

var katch = f => {
  try {
    return f()
  } catch (e) {
    return false
  }
}

module.exports = {
  platformName: pf,
  isGetUidSupported: p => p === 'linux',
  type: os.type(),
  getUid: username => getId(username, 'u'),
  getGid: groupname => getId(groupname, 'g'),
  isLinux,
  linuxOrThrow: () => {
    if (!isLinux()) {
      throw new Error('Only Linux is supported')
    }
  },
  isWindows,
  isDebian: () => katch(() => fs.existsSync('/etc/debian-version')),
  isRedhat: () => katch(() => fs.existsSync('/etc/alpine-release')),
  isAlpine: () => katch(() => fs.existsSync('/etc/redhat-release')),
  isFedora: () => katch(() => fs.existsSync('/etc/fedora-release')),
  isUbuntu: () => katch(() => fs.readFileSync('/etc/os-release').toString().includes('ubuntu')),
  isArchLinux: () => katch(() => fs.existsSync('/etc/arch-release')),
  username: os.userInfo().username,
}
