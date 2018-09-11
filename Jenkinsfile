node ***REMOVED***
    def image
    stage('Clone repository') ***REMOVED***
        checkout scm
    ***REMOVED***
 
    stage('build image')***REMOVED***
         sh 'docker build --no-cache --rm --build-arg "ANGULAR_MODE=stage" -t denbicloud/cloud-portal-webapp:dev .'
        ***REMOVED***
               
    stage('push image')***REMOVED***
    withDockerRegistry([ credentialsId: "docker1", url: "" ]) ***REMOVED***
    sh 'docker push denbicloud/cloud-portal-webapp:dev'
   ***REMOVED***
   ***REMOVED***              
 ***REMOVED***
