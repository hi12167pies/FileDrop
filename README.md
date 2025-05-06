Anonymous file uploading service.

Very basic and put together, recommened you edit this if you are going to actually use it, or at least have it private.

Features:
- Shows upload progress during an upload
- Files are stored in the `uploads/` folder of the working directory
- All files are stored as a hash and has a `[HASH].metadata` file containing info about it's name

# .env
```
PORT = 80

# Should this disable the feature to browse all files on the server?
DISABLE_FILE_BROWSING = false
```