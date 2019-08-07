enum Lifetime_States {
    EXPIRED = 0,
    EXPIRES_SOON = 1,
    VALID_LIFETIME = 2
}

enum Project_States {
    ACTIVE = 2,
    SUSPENDED = 4

}

enum Application_States {
    SUBMITTED = 1,
    APPROVED = 2,
    DECLINED = 3,
    MODIFICATION_REQUESTED = 4,
    MODIFICATION_DECLINED = 5,
    WAIT_FOR_CONFIRMATION = 6,
    CONFIRMATION_DENIED = 7,
    TERMINATED = 8

}

enum Vm_Statuses {
    ACTIVE = 1,
    SHUTOFF = 2,
    DELETED = 3,
    CLIENT_OFFLINE = 4
}

export abstract class AbstractBaseClasse {

    /**
     * If the site is loaded with values.
     * @type {boolean}
     */
    isLoaded: boolean = false;

    /**
     * If the user is a vo admin.
     * @type {boolean}
     */
    is_vo_admin: boolean = false;

    lifetime_states: typeof Lifetime_States = Lifetime_States;
    project_states: typeof Project_States = Project_States;
    application_states: typeof Application_States = Application_States;
    vm_statuses = Vm_Statuses;

    collapse_status: { [id: string]: boolean } = {};

    // notification Modal variables
    public notificationModal;
    public notificationModalTitle = 'Notification';
    public notificationModalMessage = 'Please wait...';
    public notificationModalType = 'info';
    public notificationModalInfoMessage = '';
    public notificationModalIsClosable = false;
    public notificationModalStay: boolean;

    public resetNotificationModal() {
        this.notificationModalTitle = 'Notification';
        this.notificationModalMessage = 'Please wait...';
        this.notificationModalIsClosable = false;
        this.notificationModalType = 'info';
    }

    public updateNotificationModal(title: string, message: string, closable: true, type: string) {
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

    public setCollapseStatus(id: string, status: boolean): void {

        this.collapse_status[id] = status;

    }

    /**
     * Switch status of collapse.
     * @param {string} id
     */
    public switchCollapseStatus(id: string) {
        this.collapse_status[id] = !this.getCollapseStatus(id);
    }

    lifeTimeReached(lifetimeDays: number, running: number): Lifetime_States {
        if ((lifetimeDays - running) < 0) {
            // expired
            return this.lifetime_states.EXPIRED
        } else if ((lifetimeDays - running) < 21) {
            // expires soon
            return this.lifetime_states.EXPIRES_SOON
        } else {
            // still valid
            return this.lifetime_states.VALID_LIFETIME
        }

    }

}
