# knova-recontributor

One HTTP request per second. Can be run from the command line or included as part of another project.

CLI:
f => path to id list *required
u => url with token {id} *required
t => dry (test) run (will hit google.com)
l => log path
d => debug logging

Usage if you are including it as part of another project:

var knovaRecontributor = require('knova-recontributor');
knovaRecontributor.updateKnova(IDList, tokenString, callback);

It will loop through the IDList, replacing the token in the url with each element and perform an HTTP request.

If any requests fail, it will write each failed ID to a file 'failedIDs.csv' in the project directory.
