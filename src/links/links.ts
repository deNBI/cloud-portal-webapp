import {environment} from '../environments/environment';

export const WIKI_SNAPSHOTS: string = `${environment.WIKI_PRE}simple_vm/snapshots/`;
export const WIKI: string = `${environment.WIKI_PRE}`;
export const WIKI_GENERATE_KEYS: string = `${environment.WIKI_PRE}quickstart/#generate-ssh-keys`;
export const WIKI_NEWS_MANAGEMENT: string = `${environment.WIKI_PRE}cloud_admin/#news-management`;
export const WIKI_SIMPLEVM_CUSTOMISATION: string = `${environment.WIKI_PRE}simple_vm/customization`;
export const WIKI_EXTEND_VOLUME: string = `${environment.WIKI_PRE}simple_vm/volumes/#extend-a-volume`;
export const WIKI_VOLUME_OVERVIEW: string = `${environment.WIKI_PRE}simple_vm/volumes/`;
export const WIKI_RESENV_LINK: string = `${environment.WIKI_PRE}simple_vm/customization/#research-environments`;
export const WIKI_RSTUDIO_LINK: string = `${environment.WIKI_PRE}simple_vm/customization/#rstudio`;
export const WIKI_GUACAMOLE_LINK: string = `${environment.WIKI_PRE}simple_vm/customization/#apache-guacamole`;
export const WIKI_NEW_INSTANCE_LINK: string = `${environment.WIKI_PRE}simple_vm/new_instance/`;
export const WIKI_INSTANCE_OVERVIEW_LINK: string = `${environment.WIKI_PRE}simple_vm/instance_overview/`;
export const WIKI_INSTANCE_DETAIL_LINK: string = `${environment.WIKI_PRE}simple_vm/instance_detail/`;
export const WIKI_LINK_ACCOUNTS: string = `${environment.WIKI_PRE}portal/user_information/#link-accounts-to-elixir`;
export const WIKI_PUBLICATIONS: string = `${environment.WIKI_PRE}citation_and_publication/#publications`;
export const WIKI_MEMBER_MANAGEMENT: string = `${environment.WIKI_PRE}portal/project_overview/#member-management`;
export const WIKI_FAQ: string = `${environment.WIKI_PRE}FAQ/`;
export const WIKI_MOTD: string = `${environment.WIKI_PRE}cloud_admin/news_management/#message-of-the-day`;
export const SCALE_SCRIPT_LINK: string = 'https://raw.githubusercontent.com/deNBI/user_scripts/master/bibigrid/scaling.py';
export const WIKI_MOUNT_VOLUME: string = `${environment.WIKI_PRE}simple_vm/volumes/#mount-a-volume`;
export const WIKI_GROUP_INVITATIONS: string = `${environment.WIKI_PRE}simple_vm/project_overview/#inviting-members`;
export const SCALING_UP_WIKI: string = `${environment.WIKI_PRE}simple_vm/cluster_overview/#scale-up`;

export const WIKI_LNKS: string[] =
  [
    WIKI_SNAPSHOTS,
    WIKI,
    WIKI_GENERATE_KEYS,
    WIKI_NEWS_MANAGEMENT,
    WIKI_SIMPLEVM_CUSTOMISATION,
    WIKI_EXTEND_VOLUME,
    WIKI_VOLUME_OVERVIEW,
    WIKI_RESENV_LINK,
    WIKI_RSTUDIO_LINK,
    WIKI_GUACAMOLE_LINK,
    WIKI_NEW_INSTANCE_LINK,
    WIKI_INSTANCE_OVERVIEW_LINK,
    WIKI_INSTANCE_DETAIL_LINK,
    WIKI_LINK_ACCOUNTS,
    SCALE_SCRIPT_LINK,
    WIKI_PUBLICATIONS,
    WIKI_MEMBER_MANAGEMENT,
    WIKI_FAQ,
    WIKI_MOTD
  ];
