enum Lifetime_Statuses ***REMOVED***
    EXPIRED = 0,
    EXPIRES_SOON = 1,
    VALID_LIFETIME = 2
***REMOVED***

enum Project_Statuses ***REMOVED***
    ACTIVE = 2,
    SUSPENDED = 4

***REMOVED***

enum Application_Statuses ***REMOVED***
    SUBMITTED = 1,
    APPROVED = 2,
    DECLINED = 3,
    MODIFICATION_REQUESTED = 4,
    MODIFICTION_DECLINED = 5,
    WAIT_FOR_CONFIRMATION = 6,
    CONFIRMATION_DENIED = 7

***REMOVED***

enum Vm_Statuses ***REMOVED***
    ACTIVE = 1,
    SUSPENDED = 2,
    DELETED = 3,
    CLIENT_OFFLINE = 4
***REMOVED***

export abstract class AbstractBaseClasse ***REMOVED***

    /**
     * If the site is loaded with values.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded: boolean = false;

    /**
     * If the user is a vo admin.
     * @type ***REMOVED***boolean***REMOVED***
     */
    is_vo_admin: boolean = false;

    lifetime_statuses = Lifetime_Statuses;
    project_statuses = Project_Statuses;
    application_statuses = Application_Statuses;
    vm_statuses = Vm_Statuses;

    collapse_status: ***REMOVED*** [id: string]: boolean ***REMOVED*** = ***REMOVED******REMOVED***;

    // notification Modal variables
    public notificationModal;
    public notificationModalTitle = 'Notification';
    public notificationModalMessage = 'Please wait...';
    public notificationModalType = 'info';
    public notificationModalInfoMessage = '';
    public notificationModalIsClosable = false;
    public notificationModalStay: boolean;

    public resetNotificationModal() ***REMOVED***
        this.notificationModalTitle = 'Notification';
        this.notificationModalMessage = 'Please wait...';
        this.notificationModalIsClosable = false;
        this.notificationModalType = 'info';
    ***REMOVED***

    public updateNotificationModal(title: string, message: string, closable: true, type: string) ***REMOVED***
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    ***REMOVED***

    public makeNotificationModalClosable(closable: boolean) ***REMOVED***
        this.notificationModalIsClosable = closable;
    ***REMOVED***

    public changeNotificationModalTitle(title: string) ***REMOVED***
        this.notificationModalTitle = title;
    ***REMOVED***

    public changeNotificationModalMessage(message: string) ***REMOVED***
        this.notificationModalMessage = message;
    ***REMOVED***

    public changeNotificationModalType(type: string) ***REMOVED***
        this.notificationModalType = type;
    ***REMOVED***

    /**
     * Get a collapse status.
     * @param ***REMOVED***string***REMOVED*** id
     * @returns ***REMOVED***boolean***REMOVED***
     */
    public getCollapseStatus(id: string) ***REMOVED***
        if (id in this.collapse_status) ***REMOVED***
            return this.collapse_status[id];
        ***REMOVED*** else ***REMOVED***
            this.collapse_status[id] = true;

            return true;
        ***REMOVED***
    ***REMOVED***

    public setCollapseStatus(id: string, status: boolean): void ***REMOVED***

        this.collapse_status[id] = status;

    ***REMOVED***

    /**
     * Switch status of collapse.
     * @param ***REMOVED***string***REMOVED*** id
     */
    public switchCollapseStatus(id: string) ***REMOVED***
        this.collapse_status[id] = !this.getCollapseStatus(id);
    ***REMOVED***

    lifeTimeReached(lifetimeDays: number, running: number): Lifetime_Statuses ***REMOVED***
        if ((lifetimeDays - running) < 0) ***REMOVED***
            // expired
            return this.lifetime_statuses.EXPIRED
        ***REMOVED*** else if ((lifetimeDays - running) < 21) ***REMOVED***
            // expires soon
            return this.lifetime_statuses.EXPIRES_SOON
        ***REMOVED*** else ***REMOVED***
            // still valid
            return this.lifetime_statuses.VALID_LIFETIME
        ***REMOVED***

    ***REMOVED***

***REMOVED***
