enum Lifetime_States {
  EXPIRED = 0,
  EXPIRES_SOON = 1,
  VALID_LIFETIME = 2
}

enum Project_States {
  ACTIVE = 2,
  SUSPENDED = 9,
  WAITING = 10

}

export enum ExtensionRequestType {
  NONE,
  EXTENSION = 1,
  MODIFICATION = 2,
  CREDIT = 3
}

export enum Application_States {
  SUBMITTED = 1,
  APPROVED = 2,
  DECLINED = 3,
  MODIFICATION_REQUESTED = 4,
  MODIFICATION_DECLINED = 5,
  WAIT_FOR_CONFIRMATION = 6,
  CONFIRMATION_DENIED = 7,
  TERMINATED = 8,
  SUSPENDED = 9,
  TERMINATION_REQUESTED = 10,
  EXTENSION_REQUESTED = 11,
  EXTENSION_DECLINED = 12,
  CREDITS_REQUESTED = 13,
  CREDITS_DECLINED = 14

}

export enum Application_States_Strings {
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  DECLINED = 'declined',
  MODIFICATION_REQUESTED = 'modification requested',
  MODIFICATION_DECLINED = 'modification declined',
  WAIT_FOR_CONFIRMATION = 'wait for confirmation',
  CONFIRMATION_DENIED = 'confirmation denied',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
  TERMINATION_REQUESTED = 'termination requested',
  EXTENSION_REQUESTED = 'extension requested',
  EXTENSION_DECLINED = 'extension declined',
  CREDITS_REQUESTED = 'credits requested',
  CREDITS_DECLINED = 'credits declined'

}

enum Vm_Statuses {
  ACTIVE = 1,
  SHUTOFF = 2,
  DELETED = 3,
  CLIENT_OFFLINE = 4,
  'POWERING OFF' = 5,
  RESTARTING = 6,
  'NOT FOUND' = 7
}

/**
 * Abstract class for basic things.
 */
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
  vm_statuses: typeof Vm_Statuses = Vm_Statuses;

  collapse_status: { [id: string]: boolean } = {};

  // notification Modal variables
  public notificationModalTitle: string = 'Notification';
  public notificationModalMessage: string = 'Please wait...';
  public notificationModalType: string = 'info';
  public notificationModalInfoMessage: string = '';
  public notificationModalIsClosable: boolean = false;
  public notificationModalStay: boolean;

  public resetNotificationModal(): void {
    this.notificationModalTitle = 'Notification';
    this.notificationModalMessage = 'Please wait...';
    this.notificationModalIsClosable = false;
    this.notificationModalType = 'info';
  }

  public updateNotificationModal(title: string, message: string, closable: true, type: string): void {
    this.notificationModalTitle = title;
    this.notificationModalMessage = message;
    this.notificationModalIsClosable = closable;
    this.notificationModalType = type;
  }

  /**
   * Get a collapse status.
   * @param {string} id
   * @returns {boolean}
   */
  public getCollapseStatus(id: string): boolean {
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
  public switchCollapseStatus(id: string): void {
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

  copyToClipboard(text: string): void {
    document.addEventListener('copy', (clipEvent: ClipboardEvent): void => {
      clipEvent.clipboardData.setData('text/plain', (text));
      clipEvent.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

}
