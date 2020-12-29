# SoundCloud Downloader 🎛️
Download SoundCloud songs **with all their id3 tags** such as an album cover! Just paste your urls 
into the ```Song Urls.csv``` file and run the program. Happy listening! :blush:

## Instructions :memo:
Make sure [Git](https://git-scm.com/) and [node.js](https://nodejs.org/en/download/) are installed!

First, clone the repository to your local machine.

```
git clone https://github.com/ethans333/soundcloudDownloader
```

Or, if you'd like to avoid downloading [Git](https://git-scm.com/) you can just download the code from [this repository](https://github.com/ethans333/soundcloudTerminal).<br><br>

Go into the main file's directory
```
cd ./soundcloudDownloader
cd ./Scripts
```

To install the dependencies, run

```
npm install
```

## Use :thinking:	

Paste your urls in the ```Song Urls.csv``` file. Paste your urls like so
```
url1
url2
...
```
Note: Make sure your urls are the song's page! This format: **https://soundcloud.com/[artist-name]/[song-title]**

Start the program and make sure you're in the ```Path to repository/soundcloudDownloader/Scripts```
```
npm start
```

## Bugs :bug:
So unfortunately when downloading a large number of files SoundCloud sort of recognizes that you're not an actual user
and the **download loop freezes**. This is something I've attempted to fix but couldn't. In order to fix this, when it gets
stuck **just click on the browser and downloading will resume**. You might need to do this several times.

Another issue is when you **input songs with track banner art**, for example this song [here](https://soundcloud.com/monstercat/hush-fopspeen-bound-2-u) the program
will either not download the song or crash entirely, so it's best to **avoid using songs with track banner art. I'll perhaps
add support for this in the future.**

## Notes
Made this project for myself because I pay for Spotify Premium but there's no way im going to also pay for SoundCloud Go.
So I download the songs using my program with all their id3 tags into a folder and then tell spotify to upload that to a
local server, getting SoundCloud songs on my phone. If there are any issues, bugs or you just need help let me know and I'll
be happy to get back to you! Thanks for trying out my program!
