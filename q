[1mdiff --git a/src/app/projectmanagement/overview.component.ts b/src/app/projectmanagement/overview.component.ts[m
[1mindex b089317..c805a8d 100644[m
[1m--- a/src/app/projectmanagement/overview.component.ts[m
[1m+++ b/src/app/projectmanagement/overview.component.ts[m
[36m@@ -135,6 +135,8 @@[m [mexport class OverviewComponent {[m
                 if (!shortname) {[m
                     shortname = group['name'][m
                 }[m
[32m+[m[32m                console.log('2')[m
[32m+[m
 [m
                 let newProject = new Project([m
                     Number(groupid),[m
[36m@@ -151,16 +153,21 @@[m [mexport class OverviewComponent {[m
                 if (expirationDate) {[m
                     newProject.DateEnd = moment(expirationDate).date() + "." + (moment(expirationDate).month() + 1) + "." + moment(expirationDate).year();[m
                 }[m
[32m+[m
                 let newProjectApplications = [];[m
[31m-                for (let application of group['applications']) {[m
[31m-                    let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS")[m
[31m-                    let membername = application['user']['firstName'] + ' ' + application['user']['lastName'][m
[31m-                    let newMemberApplication = new ProjectMemberApplication([m
[31m-                        application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(),[m
[31m-                    )[m
[31m-                    newProjectApplications.push(newMemberApplication)[m
[32m+[m[32m                if (group['applications']) {[m
[32m+[m[32m                    for (let application of group['applications']) {[m
[32m+[m[32m                        let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS")[m
[32m+[m[32m                        let membername = application['user']['firstName'] + ' ' + application['user']['lastName'][m
[32m+[m[32m                        let newMemberApplication = new ProjectMemberApplication([m
[32m+[m[32m                            application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(),[m
[32m+[m[32m                        )[m
[32m+[m[32m                        newProjectApplications.push(newMemberApplication)[m
[32m+[m[32m                    }[m
[32m+[m
[32m+[m[32m                    newProject.ProjectMemberApplications = newProjectApplications;[m
                 }[m
[31m-                newProject.ProjectMemberApplications = newProjectApplications;[m
[32m+[m
                 this.projects.push(newProject);[m
             }[m
             this.isLoaded = true;[m
[36m@@ -284,7 +291,7 @@[m [mexport class OverviewComponent {[m
                 this.application_action = 'rejected';[m
                 this.application_member_name = membername;[m
                 this.loaded = true;[m
[31m-                this.application_action_done=true;[m
[32m+[m[32m                this.application_action_done = true;[m
 [m
 [m
             })[m
[36m@@ -361,7 +368,6 @@[m [mexport class OverviewComponent {[m
         }[m
         else {[m
             this.UserModalFacility = facility;[m
[31m-            console.log(facility)[m
 [m
         }[m
     }[m
[36m@@ -375,7 +381,6 @@[m [mexport class OverviewComponent {[m
 [m
                 } else {[m
 [m
[31m-[m
                     this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");[m
                 }[m
             },[m
