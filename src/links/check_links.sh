#!/bin/bash
WIKI_SNAPSHOTS=https://portal-dev.denbi.de/wiki/simple_vm/snapshots/
WIKI=https://portal-dev.denbi.de/wiki/
WIKI_GENERATE_KEYS=https://portal-dev.denbi.de/wiki/quickstart/#generate-ssh-keys
WIKI_NEWS_MANAGEMENT=https://portal-dev.denbi.de/wiki/cloud_admin/news_management/
WIKI_SIMPLEVM_CUSTOMISATION=https://portal-dev.denbi.de/wiki/simple_vm/customization/
WIKI_EXTEND_VOLUME=https://portal-dev.denbi.de/wiki/simple_vm/volumes/#extend-a-volume
WIKI_VOLUME_OVERVIEW=https://portal-dev.denbi.de/wiki/simple_vm/volumes/
WIKI_RESENV_LINK=https://portal-dev.denbi.de/wiki/simple_vm/customization/#research-environments
WIKI_RSTUDIO_LINK=https://portal-dev.denbi.de/wiki/simple_vm/customization/#rstudio
WIKI_GUACAMOLE_LINK=https://portal-dev.denbi.de/wiki/simple_vm/customization/#apache-guacamole
WIKI_NEW_INSTANCE_LINK=https://portal-dev.denbi.de/wiki/simple_vm/new_instance/
WIKI_INSTANCE_OVERVIEW_LINK=https://portal-dev.denbi.de/wiki/simple_vm/instance_overview/
WIKI_INSTANCE_DETAIL_LINK=https://portal-dev.denbi.de/wiki/simple_vm/instance_detail/
WIKI_LINK_ACCOUNTS=https://portal-dev.denbi.de/wiki/portal/user_information/#link-accounts-to-elixir
SCALE_SCRIPT_LINK=https://raw.githubusercontent.com/deNBI/user_scripts/master/bibigrid/scaling.py
SCALING_UP_WIKI=https://portal-dev.denbi.de/wiki/simple_vm/Cluster/cluster_overview/#3-scale-up
WIKI_PUBLICATIONS=https://portal-dev.denbi.de/wiki/citation_and_publication/#publications
WIKI_MEMBER_MANAGEMENT=https://portal-dev.denbi.de/wiki/portal/project_overview/#member-management
WIKI_FAQ=https://portal-dev.denbi.de/wiki/FAQ/
WIKI_MOTD=https://portal-dev.denbi.de/wiki/cloud_admin/news_management/#message-of-the-day
WIKI_CREATE_SNAPSHOT_LINK=https://portal-dev.denbi.de/wiki/simple_vm/snapshots/#create-snapshot
WIKI_VOLUMES_LINK=https://portal-dev.denbi.de/wiki/simple_vm/volumes/
WIKI_MOSH_LINK=https://portal-dev.denbi.de/wiki/Tutorials/Mosh/
WIKI_PERSONAL_DATA=https://portal-dev.denbi.de/wiki/portal/personal_data/
WIKI_EPHEMERAL_LINK=https://portal-dev.denbi.de/wiki/simple_vm/new_instance/#information-for-ephemeral-flavors
SURVEY_LINK=https://www.surveymonkey.de/r/HQW9V7C

# WAGTAIL LINKS

FACILITY_NEWS=https://portal-dev.denbi.de/news/facility-news/
POLICIES=https://portal-dev.denbi.de/about/policies/
PROJECT_TYPES=https://portal-dev.denbi.de/about/project-types/
SIMPLE_VM=https://portal-dev.denbi.de/about/project-types/simplevm/
OPENSTACK=https://portal-dev.denbi.de/about/project-types/openstack/
PUBLICATIONS=https://portal-dev.denbi.de/about/publications/
STATUS_LINK=https://status.cloud.denbi.de/status
SUPPORT_LINK=https://cloud.denbi.de/support/
ZAMMAD_HELPDESK_LINK=https://helpdesk.cloud.denbi.de

# EXTERNAL LINK
GDPR_LINK=https://gdpr.eu/article-9-processing-special-categories-of-personal-data-prohibited/


LINKS=("$ZAMMAD_HELPDESK_LINK" "$WIKI_SNAPSHOTS" "$SURVEY_LINK"  "$WIKI_RSTUDIO_LINK" "$SCALING_UP_WIKI"  "$SCALE_SCRIPT_LINK" "$WIKI" "$WIKI_GENERATE_KEYS" "$WIKI_NEWS_MANAGEMENT" "$WIKI_SIMPLEVM_CUSTOMISATION" "$WIKI_EXTEND_VOLUME" "$WIKI_VOLUME_OVERVIEW" "$WIKI_RESENV_LINK" "$WIKI_GUACAMOLE_LINK" "$WIKI_NEW_INSTANCE_LINK" "$WIKI_INSTANCE_OVERVIEW_LINK" "$WIKI_INSTANCE_DETAIL_LINK" "$WIKI_LINK_ACCOUNTS" "$WIKI_PUBLICATIONS" "$WIKI_MEMBER_MANAGEMENT" "$WIKI_FAQ" "$WIKI_MOTD" "$FACILITY_NEWS" "$POLICIES" "$PROJECT_TYPES" "$SIMPLE_VM" "$OPENSTACK" "$PUBLICATIONS" "$STATUS_LINK" "$SUPPORT_LINK" "$WIKI_CREATE_SNAPSHOT_LINK" "$WIKI_VOLUMES_LINK" "$WIKI_MOSH_LINK" "$WIKI_EPHEMERAL_LINK" "$WIKI_PERSONAL_DATA" "$GDPR_LINK")

for i in "${LINKS[@]}"; do
  echo "$i"
  status_code=$(curl -o /dev/null -Isw '%{http_code}\n' "$i")
  if [[ "$status_code" -ne 200 ]]; then
    echo "Site status changed to $status_code"
    exit 1
  else
    echo Status: "$status_code"

  fi
done
