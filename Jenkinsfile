node {
    def image
    stage('Clone repository') {
        checkout scm
    }
 
    stage('build image'){
         sh 'docker build --no-cache --build-arg "ANGULAR_MODE=stage" -t denbicloud/cloud-portal-webapp:dev .'
        }
               
    stage('push image'){
    withDockerRegistry([ credentialsId: "docker1", url: "" ]) {
    sh 'docker push denbicloud/cloud-portal-webapp:dev'
   }
   }              
 }
