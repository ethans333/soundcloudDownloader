const puppeteer = require('puppeteer');
const fs = require('fs');
const req = require('request');
const http = require('http');
const got = require('got');
const NodeID3 = require('node-id3');
const readline = require('readline');
const selectors = require('./selectors');
const { resolve } = require('path');

const getDownloadUrl = async (url, browser) => {
    const page = await browser.newPage();

    await page.goto(url);
    page.setRequestInterception(true);

    const baseUrl = 'https://cf-hls-media.sndcdn.com/media/';

    await new Promise((resolve) => {

        page.on('request', async (request) => {
          if(request.url().includes(baseUrl)){
            const downloadUrl = fixUrl(request.url());
            const info = await getSongInfo(page);
            await downloadSong(downloadUrl, info.title);
            await tagSong(info);
            await request.abort();
            await page.close();
            resolve();
          } else {
            request.continue();
          }
        });
    });
};

const fixUrl = (url) => {
    const urlArray = url.split("/");
    url = url.replace(urlArray[4], '000000');
    url = url.replace(urlArray[5], '9999999999');
    return url;
};

const rmChars = (string) => {
    const badChars = ['?', '"', '*', '<', '>', ':', '|'];
    badChars.forEach(char => string = string.replace(char, ''));
    return string
};

const downloadSong = async (url, title) => {
    await new Promise((resolve) => {
        if(!fs.existsSync('../Saved Songs')){
            fs.mkdirSync('../Saved Songs'); 
        }
        
        req
        .get(url)
        .pipe(fs.createWriteStream(`../Saved Songs/${rmChars(title)}.mp3`))
        .on('finish', () => {
            console.log(`Downloaded ${title} ✓`);
            resolve();
        });
    });
};

const getSongInfo = async (page) => {
    let info = await page.evaluate((title, artist, albumCover) => {
        return {
            title: document.querySelector(title).innerText,
            artist: document.querySelector(artist).innerText,
            albumCover: document.querySelector(albumCover).style.backgroundImage,
        }
    }, selectors.title, selectors.artist, selectors.albumCover);

    info.albumCover = info.albumCover.replace('url("', '');
    info.albumCover = info.albumCover.replace('")', '');
    info.title = rmChars(info.title);
    info.artist = rmChars(info.artist);

    return info;
};

const tagSong = async (info) => {
    const file = `../Saved Songs/${info.title}.mp3`;

    for (const key in info) {
        info[key] = info[key].replace(/[^\x00-\x7F]/g, "");
    }

    const tags = {
      title: rmChars(info.title),
      artist: rmChars(info.artist),
      album: rmChars(info.title),
      image: {
        mime: "jpeg",
        type: {
          id: 3,
          name: "Album Cover"
        },
        imageBuffer: (await got(info.albumCover, { responseType: 'buffer' })).body
      },
    };

    NodeID3.create(tags);
    NodeID3.write(tags, file);
};

(() => {
    const urlsPath = '../Song Urls.csv';

    const readInterface = readline.createInterface({
        input: fs.createReadStream(urlsPath),
        output: process.stdout,
        console: false,
        terminal: false,
    });
    
    let urls = [];
    readInterface.on('line', function(line) {
        urls.push(line);
    }).on('close', async () => {
        const browser = await puppeteer.launch({headless: false,
        args: [`--window-size=${300},${300}`]});

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            await getDownloadUrl(url, browser);
        }

        console.log(`${urls.length} Songs Downloaded ✓`);

        fs.writeFile(urlsPath, '', (err) => {
            if (err) throw err;
        });

        await browser.close();
    });
})();
