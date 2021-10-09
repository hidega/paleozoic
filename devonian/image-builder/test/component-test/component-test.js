var ShSupport = require('@devonian/sh-support')
var commons = require('@devonian/commons')

var shSupport = ShSupport.newInstance()

var PODMAN_OPTS = '--cgroup-manager=cgroupfs'
var BASE_IP = '192.168.33'
var CONTAINER_IP = BASE_IP + '.45'
var CONTAINER_PORT = 18000
var CONTAINER_NAME = 'teststuff'
var HOST_IP = '127.0.0.1'

var startContainer = healthcheckPath => `
  podman ${PODMAN_OPTS} run -d \
    --env FOO_ENV=foo_env \
    --name=${CONTAINER_NAME} \
    --network=$NETWORK_NAME \
    --ip=${CONTAINER_IP} \
    --health-cmd=${healthcheckPath} \
    --health-timeout=15s \
    --expose=${CONTAINER_PORT} \
    --publish=${HOST_IP}:${CONTAINER_PORT}:${CONTAINER_PORT} \
    --hostname=${CONTAINER_NAME} \
    docker-archive:$TEST_DIR/${CONTAINER_NAME}.img \
    /opt/prg/foo/start.sh
  ${shSupport.exitErrorIfLastFailedCmd('Could not start container')}
  sleep 1
` 

var healthcheckCmd = `podman healthcheck run ${CONTAINER_NAME}`

var testScript = shSupport.normalizeScript(`
  ${shSupport.shebang()}
  ${shSupport.clearErrorsCmd}
  ${shSupport.checkCurl} 
  TEST_DIR=${__dirname}
  cd $TEST_DIR

  function initialize() {
    ${shSupport.removeAllContainers}
    ${shSupport.removeAllImages} 
  }

  function setup_network() { 
    ${shSupport.removeAllNetworks}
    ${shSupport.createNetwork(BASE_IP + '.0/24')}
    NETWORK_NAME=${shSupport.fetchSingleNetworkNameExpr}
  }

  function create_image() { 
    npm i && npm run tr image
    ${shSupport.exitErrorIfLastFailedCmd('Could not create image with npm task')}
  }

  function case_healthy_container() { 
    ${startContainer('/opt/prg/foo/healthcheck.sh')} 
    ${healthcheckCmd}
    ${shSupport.exitErrorIfLastFailedCmd('Healthcheck failed')}
    DATA=$(curl -G ${HOST_IP}:${CONTAINER_PORT}/somedir/somefile.txt)
    [ ! "$DATA" == "Some file content" ] && ${shSupport.exitErrorCmd('Could not access service on ${HOST_IP}:${CONTAINER_PORT}/somedir/somefile.txt')}
    ${shSupport.shutdownContainer(CONTAINER_NAME)}
    echo "___ case_healthy_container OK ___"
  }

  function case_unhealthy_container() {
    ${startContainer('/opt/prg/foo/healthcheck-fail.sh')} 
    ${healthcheckCmd}
    [ "$?" -ne "1" ] && ${shSupport.exitErrorCmd('Unhealthy container appears to be healthy')}
    ${shSupport.shutdownContainer(CONTAINER_NAME)}
    echo "___ case_unhealthy_container OK ___"
  }

  initialize
  setup_network
  create_image
  case_healthy_container
  case_unhealthy_container
  exit 0
`)

console.log(testScript)

console.log('\nRunning tests')

var counter = 0
var interval = setInterval(() => process.stdout.write('.' + (++counter % 32 === 0 ? '\n' : '')), 500)

commons.executeScriptAsFileInTempdir(testScript)
  .then(() => console.log('OK'))
  .catch(e => console.error('ERROR\n', e) || process.exit(1))
  .finally(() => clearInterval(interval))
