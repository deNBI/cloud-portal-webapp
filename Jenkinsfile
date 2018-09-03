node {
    def image
    stage('Clone repository') {
        checkout scm
    }
 
    stage('build image'){
                    image = sh 'docker build --no-cache --build-arg "ANGULAR_MODE=stage" -t denbicloud/cloud-portal-webapp .'
        }
               
    stage('push image'){
    withDockerRegistry([ credentialsId: "docker1", url: "" ]) {
    image.push("dev")
   }
   }              
 }
