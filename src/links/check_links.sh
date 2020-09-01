#!/bin/bash
WIKI_MOUNT_VOLUME=https://cloud.denbi.de/wiki/simple_vm/volumes/#mount-a-volume
WIKI_GROUP_INVITATIONS=https://cloud.denbi.de/wiki/portal/project_overview/#inviting-members
WIKI_SNAPSHOTS=https://cloud.denbi.de/wiki/simple_vm/snapshots/
WIKI=https://cloud.denbi.de/wiki/
WIKI_GENERATE_KEYS=https://cloud.denbi.de/wiki/quickstart/#generate-ssh-keys
WIKI_VOLUME_OVERVIEW=https://cloud.denbi.de/wiki/simple_vm/volumes/
NEWS=https://cloud.denbi.de/cloudnews/

WIKI_EXTEND_VOLUME=https://cloud.denbi.de/wiki/simple_vm/volumes/#extend-a-volume
WIKI_RESENV_LINK=https://cloud.denbi.de/wiki/simple_vm/customization/#research-environments
WIKI_RSTUDIO_LINK=https://cloud.denbi.de/wiki/simple_vm/customization/#rstudio
WIKI_GUACAMOLE_LINK=https://cloud.denbi.de/wiki/simple_vm/customization/#apache-guacamole
WIKI_NEW_INSTANCE_LINK=https://cloud.denbi.de/wiki/simple_vm/new_instance/
WIKI_INSTANCE_OVERVIEW_LINK=https://cloud.denbi.de/wiki/simple_vm/instance_overview/
WIKI_INSTANCE_DETAIL_LINK=https://cloud.denbi.de/wiki/simple_vm/instance_detail/
WIKI_LINK_ACCOUNTS=https://cloud.denbi.de/wiki/portal/user_information/#link-accounts-to-elixir

WIKI_LNKS=("$WIKI_INSTANCE_DETAIL_LINK" "$WIKI_LINK_ACCOUNTS" "$WIKI_INSTANCE_OVERVIEW_LINK" "$WIKI_NEW_INSTANCE_LINK" "$WIKI_GUACAMOLE_LINK" "$WIKI_RSTUDIO_LINK" "$WIKI_RESENV_LINK" "$WIKI_VOLUME_OVERVIEW" "$WIKI_EXTEND_VOLUME" "$WIKI_MOUNT_VOLUME" "$WIKI_GROUP_INVITATIONS" "$WIKI_SNAPSHOTS" "$WIKI" "$WIKI_GENERATE_KEYS" "$NEWS")
for i in "${WIKI_LNKS[@]}"; do
  echo "$i"
  status_code=$(curl -o /dev/null -Isw '%{http_code}\n' "$i")
  if [[ "$status_code" -ne 200 ]]; then
    echo "Site status changed to $status_code"
    exit 1
  else
    echo Status: "$status_code"

  fi
done
