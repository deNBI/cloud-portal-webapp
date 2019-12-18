"use strict";
exports.__esModule = true;
exports.WIKI_VOLUME = 'https://cloud.denbi.de/wiki/portal/volumes/#mount-a-volume';
exports.WIKI_GROUP_INVITATIONS = 'https://cloud.denbi.de/wiki/portal/project_overview/#inviting-members';
exports.WIKI_SNAPSHOTS = 'https://cloud.denbi.de/wiki/portal/snapshots/';
exports.WIKI = 'https://cloud.denbi.de/wiki/';
exports.WIKI_GENERATE_KEYS = 'https://cloud.denbi.de/wiki/quickstart/#generate-ssh-keys';
exports.WIKI_LNKS = [exports.WIKI_VOLUME, exports.WIKI_GROUP_INVITATIONS, exports.WIKI_SNAPSHOTS, exports.WIKI, exports.WIKI_GENERATE_KEYS];
function checkLinks() {
    exports.WIKI_LNKS.forEach(function (link) {
        console.log(link);
        checkLink(link);
    });
}
function checkLink(link) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'link');
}
checkLinks();
