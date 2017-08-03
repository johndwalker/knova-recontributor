# knova-recontributor

One HTTP request per second. Can be run from the command line or included as part of another project.
<br>
To install:
npm i knova-recontributor
<br>
CLI:
<table>
<tr>f => path to id list *required</tr>
<tr>u => url with token {id} *required</tr>
<tr>t => dry (test) run (will hit google.com)</tr>
<tr>l => log path</tr>
<tr>d => debug logging</tr>
</table>
<br>
Usage if you are including it as part of another project:
<br>
var knovaRecontributor = require('knova-recontributor');
knovaRecontributor.updateKnova(IDList, tokenString, callback);
<br>
It will loop through the IDList, replacing the token in the url with each element and perform an HTTP request.
<br>
If any requests fail, it will write each failed ID to a file 'failedIDs.csv' in the project directory.
