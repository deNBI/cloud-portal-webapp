node {
    def image
    stage('Clone repository') {
        checkout scm
    }
 
    stage('build image'){
                    sh 'export ANGULAR_MODE="stage"'
                    image = sh 'docker build --no-cache --build-arg "ANGULAR_MODE=${ANGULAR_MODE}" -t denbicloud/cloud-portal-webapp .'
        }
               
    stage('push image'){
    withDockerRegistry([ credentialsId: "docker1", url: "" ]) {
    image.push("dev")
   }
   }              
 }
