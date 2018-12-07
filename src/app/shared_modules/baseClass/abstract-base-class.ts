enum Lifetime_Statuses {
    EXPIRED = 0,
    EXPIRES_SOON = 1,
    VALID_LIFETIME = 2,
}

enum Project_Statuses {
    ACTIVE = 2,
    SUSPENDED = 4,

}

enum Application_Statuses {
    SUBMITTED = 1,
    APPROVED = 2,
    DECLINED = 3,
    MODIFICATION_REQUESTED = 4,
    MODIFICTION_DECLINED = 5,
    WAIT_FOR_CONFIRMATION = 6,
    CONFIRMATION_DENIED = 7,

}


enum Vm_Statuses {
    ACTIVE = 1,
    SUSPENDED = 2,
    DELETED = 3,
}


export abstract class AbstractBaseClasse {

    lifetime_statuses = Lifetime_Statuses;
    project_statuses = Project_Statuses;
    application_statuses = Application_Statuses;
    vm_statuses = Vm_Statuses;

    collapse_status: { [id: string]: boolean } = {};
    isLoaded = false;


    //notification Modal variables
    public notificationModal;
    public notificationModalTitle: string = "Notification";
    public notificationModalMessage: string = "Please wait...";
    public notificationModalType: string = "info";
    public notificationModalInfoMessage: string = '';
    public notificationModalIsClosable: boolean = false;

    public resetNotificationModal() {
        this.notificationModalTitle = "Notification";
        this.notificationModalMessage = "Please wait...";
        this.notificationModalIsClosable = false;
        this.notificationModalType = "info";
    }

    public updateNotificaitonModal(title: string, message: string, closable: true, type: string) {
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    }

    public makeNotificationModalClosable(closable: boolean) {
        this.notificationModalIsClosable = closable;
    }

    public changeNotificationModalTitle(title: string) {
        this.notificationModalTitle = title;
    }

    public changeNotificationModalMessage(message: string) {
        this.notificationModalMessage = message;
    }

    public changeNotificationModalType(type: string) {
        this.notificationModalType = type;
    }



    /**
     * Get a collapse status.
     * @param {string} id
     * @returns {boolean}
     */
    public getCollapseStatus(id: string) {
        if (id in this.collapse_status) {
            return this.collapse_status[id];
        } else {
            this.collapse_status[id] = true;
            return true;
        }
    }

    /**
     * Switch status of collapse.
     * @param {string} id
     */
    public switchCollapseStatus(id: string) {
        this.collapse_status[id] = !this.getCollapseStatus(id);
    }



    lifeTimeReached(lifetimeDays: number, running: number): Lifetime_Statuses {
        if ((lifetimeDays - running) < 0) {
            // expired
            return this.lifetime_statuses.EXPIRED
        }
        else if ((lifetimeDays - running) < 21) {
            //expires soon
            return this.lifetime_statuses.EXPIRES_SOON
        }
        else {
            //still valid
            return this.lifetime_statuses.VALID_LIFETIME
        }


    }


}
