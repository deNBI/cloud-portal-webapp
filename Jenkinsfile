node ***REMOVED***
    def image
    stage('Clone repository') ***REMOVED***
        checkout scm
    ***REMOVED***
 
    stage('build image')***REMOVED***
                    sh 'export ANGULAR_MODE="stage"'
                    image = docker.build("denbicloud/cloud-portal-webapp")
        ***REMOVED***
               
    stage('push image')***REMOVED***
    withDockerRegistry([ credentialsId: "docker1", url: "" ]) ***REMOVED***
    image.push("dev")
   ***REMOVED***
   ***REMOVED***              
 ***REMOVED***
