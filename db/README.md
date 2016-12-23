This folder contains a database dump of the development build for shelfie

The following commands can be used to backup / restore it:

`mongodump -d <database_name> -o <directory_backup>`

`mongorestore -d <database_name> <directory_backup>`

`mongorestore -d shelfie shelfie.mongo/shelfie --drop`