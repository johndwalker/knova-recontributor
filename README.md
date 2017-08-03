# knova-recontributor

Performs one HTTP request per second. Can be run from the command line or included as part of another project.
<br><br>
To install:<br>
<b>npm i knova-recontributor</b>
<br><br>
CLI:
<table>
<tr><td>f => path to id list *required</td></tr>
<tr><td>u => url with token {id} *required</td></tr>
<tr><td>t => dry (test) run (will hit google.com)</td></tr>
<tr><td>l => log path</td></tr>
<tr><td>d => debug logging</td></tr>
</table>
<br>
Usage if you are including it as part of another project:
<br><br>
<b>
var knovaRecontributor = require('knova-recontributor');<br>
knovaRecontributor.updateKnova(IDList, tokenString, callback);
</b>
<br><br>
It will loop through the IDList, replacing the token in the url with each element and perform an HTTP request.
<br>
If any requests fail, it will write each failed ID to a file 'failedIDs.csv' in the project directory.
