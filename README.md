Anonymous file uploading service.

Very basic and put together, recommend you edit the code if you are going to actually use it, or at least have it private.

Features:
- Shows upload progress during an upload
- Files are stored in the `uploads/` folder of the working directory
- All files are stored as a hash and has a `[HASH].metadata` file containing info about it's name
- File list page showing all files that have been uploaded (can be disabled in .env)

# .env
```
PORT = 80

# Should this disable the feature to browse all files on the server?
DISABLE_FILE_BROWSING = false

# Legit only useful for me
PIES_AUTH_ENABLED = false
PIES_API_KEY = 
```
# Stack
Stack / how this code is setup

## Backend
- Typescript
- Express.JS
- EJS (For rendering the file page)
- Multer (For file uploads)

The backend is formatted into routes (in the src folder)

## Frontend
- Javascript (I couldn't be bothered adding typescript compiling)
- HTML (Static pages uses html instead of ejs as it is more simple)
- CSS
- XHR request for uploading, fetch for basic api requests

The frontend uses a `commons.js` file to store some common functions between multiple pages.

The frontend also has a `global.js` which handles updating the headers and global related stuff.