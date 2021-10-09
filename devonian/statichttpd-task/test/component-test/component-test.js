var ShSupport = require('@devonian/sh-support')
var commons = require('@devonian/commons')
var contract = require('@devonian/deployment-contract')

var shSupport = ShSupport.newInstance()

var PODMAN_OPTS = '--cgroup-manager=cgroupfs'
var BASE_IP = '192.168.33'
var CONTAINER_IP = BASE_IP + '.76'
var CONTAINER_PORT = 18000
var CONTAINER_NAME = 'devonian-static-httpd'
var HOST_IP = '127.0.0.1'
var VDC_CONTAINER = 'vdc-container'

var startContainer = (healthcheckPath, mountedVolume) => `
  podman ${PODMAN_OPTS} run -d \
    --env DEVONIAN_MIDDLEWARE_USER=andras \
    --env DEVONIAN_MIDDLEWARE_USER_ID=1000 \
    ${mountedVolume ? '--volumes-from=' + mountedVolume : ''} \
    --name=${CONTAINER_NAME} \
    --network=$NETWORK_NAME \
    --ip=${CONTAINER_IP} \
    --health-cmd=${healthcheckPath} \
    --health-timeout=15s \
    --expose=${CONTAINER_PORT} \
    --publish=${HOST_IP}:${CONTAINER_PORT}:${CONTAINER_PORT} \
    --hostname=${CONTAINER_NAME} \
    docker-archive:$TEST_DIR/${CONTAINER_NAME}.img \
    ${contract.SERVICE_HOME + '/' + contract.START_SCRIPT}
  ${shSupport.exitErrorIfLastFailedCmd('Could not start container')}
  sleep 1
` 

var healthcheckCmd = `podman healthcheck run ${CONTAINER_NAME}`

var testScript = shSupport.normalizeScript(`
  ${shSupport.shebang()}
  ${shSupport.clearErrorsCmd}
  ${shSupport.checkCurl} 
  TEST_DIR="${__dirname}"
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

  function case_healthy_container_with_vdc() {
    podman create -v $TEST_DIR/volume:${contract.MOUNTED_VOLUME_ROOT}:Z --name ${VDC_CONTAINER} ${contract.BASE_LINUX_IMAGE} /bin/true
    ${shSupport.exitErrorIfLastFailedCmd('Could not create volume data container')}
    ${startContainer('/opt/prg/service/healthcheck.sh', VDC_CONTAINER)} 
    ${healthcheckCmd}
    ${shSupport.exitErrorIfLastFailedCmd('Healthcheck failed')}
    DATA=$(curl -G ${HOST_IP}:${CONTAINER_PORT}/volume/test_data/test_file)
    [ ! "$DATA" == "test file content" ] && ${shSupport.exitErrorCmd('Could not access service on ' + HOST_IP + ':' + CONTAINER_PORT + '/volume/test_data/test_file')}
    ${shSupport.shutdownContainer(CONTAINER_NAME)}
    echo "___ case_healthy_container_with_vdc OK ___"
  } 

  function case_healthy_container() { 
    ${startContainer('/opt/prg/service/healthcheck.sh')} 
    ${healthcheckCmd}
    ${shSupport.exitErrorIfLastFailedCmd('Healthcheck failed')}
    DATA=$(curl -G ${HOST_IP}:${CONTAINER_PORT}/some_dir/some_file)
    [ ! "$DATA" == "some content" ] && ${shSupport.exitErrorCmd('Could not access service on ' + HOST_IP + ':' + CONTAINER_PORT + '/some_dir/some_file')}
    ${shSupport.shutdownContainer(CONTAINER_NAME)}
    echo "___ case_healthy_container OK ___"
  }

  function case_unhealthy_container() {
    ${startContainer('/opt/data/healthcheck-fail.sh')} 
    ${healthcheckCmd}
    [ "$?" -ne "1" ] && ${shSupport.exitErrorCmd('Unhealthy container appears to be healthy')}
    ${shSupport.shutdownContainer(CONTAINER_NAME)}
    echo "___ case_unhealthy_container OK ___"
  }

  initialize
  setup_network
  create_image
  case_healthy_container
  case_healthy_container_with_vdc
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

