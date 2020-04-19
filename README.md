# music-sheet-viewer

A web app to view music sheets on a tablet or convertible PC.

While it's written as a music sheet viewer, it can be used as a generic image viewer as well.

Features:
* Supports in-app rotation of 0, 90, 180, 270 degrees
* Loads music sheets in image formats (jpg and png)
* Click on the right part of the screen to advance page, left to go back, upper part to close current sheet
* Pre-loads next page for quick switching

## How to use

The input directory containing music sheet files should have the following structure:
```
- libraryFolder
  - myFirstMusicSheet
    - page1.png
    - page2.png
    - ...
  - anotherMusicSheet
    - file001.jpg
    - file002.jpg
    - ...
```

The server app takes the path to the libraryFolder, and each document is a folder. Each document folder has the individual pages in png or jpg format.

To compile and run the applications:
```
cd client
npm ci
npm run build
cd ../server
npm ci
npm run build
node lib/index.js /path/to/library/folder
```