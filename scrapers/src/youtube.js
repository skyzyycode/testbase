const ytdl = require("ytdl-core");
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:v|e(?:mbed)?)\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
const axios = require('axios');
const ytSearch = require('yt-search');




class Youtube {
   mp3 = async function ytmp3(url) {
        const match = url.match(youtubeRegex);
        const videoId = match ? match[1] || match[2] : null;
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }
       const { videos } = await ytSearch(videoId);
        if (videos.length === 0) {
            throw new Error('Video not found');
        }
        const videoDetails = videos.find(a => a.videoId === videoId);
        let reso = [128];
        let result = {};

        while (true) {
            for (let i of reso) {
                const response = await axios.post('https://c.blahaj.ca/', {
                    url: url,
                    downloadMode: "audio"
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                }).catch(e => e.response);
                 console.log(response.data);
                const data = response.data.url;
                if (data) {
                    result = data
                }
            }
            break;
        }

        return {
            metadata: {
                title: videoDetails.title,
                seconds: videoDetails.seconds,
                thumbnail: videoDetails.thumbnail,
                views: videoDetails.views.toLocaleString(),
                publish: videoDetails.ago,
                author: videoDetails.author,                
                url: videoDetails.url,
                description: videoDetails.description
            },
            download: await fetch(result).then(async(a) => Buffer.from(await a.arrayBuffer()))
      };
}

 mp4 = async function ytmp4(url) {
        const match = url.match(youtubeRegex);
        const videoId = match ? match[1] || match[2] : null;
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }
       const { videos } = await ytSearch(videoId);
        if (videos.length === 0) {
            throw new Error('Video not found');
        }
        const videoDetails = videos.find(a => a.videoId === videoId);
        let reso = [128];
        let result = {};

        while (true) {
            for (let i of reso) {
                const response = await axios.post('https://c.blahaj.ca/', {
                    url
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                }).catch(e => e.response);
                 console.log(response.data);
                const data = response.data.url;
                if (data) {
                    result = data
                }
            }
            break;
        }

        return {
            metadata: {
                title: videoDetails.title,
                seconds: videoDetails.seconds,
                thumbnail: videoDetails.thumbnail,
                views: videoDetails.views.toLocaleString(),
                publish: videoDetails.ago,
                author: videoDetails.author,                
                url: videoDetails.url,
                description: videoDetails.description
            },
            download: await fetch(result).then(async(a) => Buffer.from(await a.arrayBuffer()))
        };
}
  playlist = async (url) => {
      let response = await axios.post(
        "https://solyptube.com/findchannelvideo",
        `url=${url}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Accept: "application/json, text/javascript, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
            Referer:
              "https://solyptube.com/youtube-playlist-downloader#searchrResult",
          },
        },
      ).catch(e => e.response)
      let info = response.data;
      if (!info.data.title) return info
     return {
        metadata: {
          title: info.data.title,
          total: info.data.estimatedItemCount + " Videos",
          views: info.data.views,
          thumbnail: info.data.thumbnails[0].url,
          update: info.data.lastUpdated,
          author: info.data.author.name,
        },
        items: info.data.items.map((a) => ({
          title: a.title,
          duration: a.duration,
          url: a.shortUrl,
          thumbnail: a.thumbnails[0].url,
          author: a.author.name,
        })),
      }
   }
}

module.exports = new Youtube()