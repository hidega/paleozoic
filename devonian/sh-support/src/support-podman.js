function ShSupportPodman() {
  this.PODMAN = 'podman'

  this.removeAllImages = `
    ${this.PODMAN} image rm -af
    ${this.exitErrorIfLastFailedCmd('Could not remove images')}`

  this.removeAllContainers = `
    ${this.PODMAN} container stop -a
    ${this.PODMAN} container rm -af
    ${this.exitErrorIfLastFailedCmd('Could not remove containers')}`

  this.shutdownContainer = name => this.wrapCmdBlock(`
    ${this.PODMAN} container stop ${name}
    sleep 1
    ${this.PODMAN} container rm -f ${name}
    sleep 1 
  `)

  this.removeAllNetworks = `
    ${this.PODMAN} network prune -f
    ${this.exitErrorIfLastFailedCmd('Could not remove networks')}`

  this.createNetwork = subnet => `
    ${this.PODMAN} network create --subnet ${subnet}
    ${this.exitErrorIfLastFailedCmd('Could not create network')}`

  this.fetchSingleNetworkNameExpr = `$(${this.PODMAN} network ls | grep cni | awk '{print $2}')`
}

module.exports = ShSupportPodman
