# Puretube

![Homepage Image](https://hc-cdn.hel1.your-objectstorage.com/s/v3/92f6344393ffb80ad4731184763055ab5d8144ac_screenshot_2025-07-26_071233.png)

![Main Webapp Image](https://hc-cdn.hel1.your-objectstorage.com/s/v3/89ed88f20856f50b1cf3c3082f94796265266119_screenshot_2025-07-26_071940.png)

Puretube is a youtube wrapper designed to provide a cleaner, more focused way to interact with YouTube content. Instead of being overwhelmed by recommendations, trending videos, and endless scrolling, users can search for specific content, watch videos without distractions, and track their viewing habits to maintain digital wellness. 

I created this app for myself because when I want to try out something on youtube after I open the app or web just after seeing the content I forgot what I came there for, after playing a particular video instead of watching it I was watching the comments and recommended videos all the time, instead of sticking with just a single useful short I started doom scrolling and this is the app that I came up with to solve up this problem. 

--- 

The api key was leaked by me so I had to delete the repo rotate the key and then update this ;) The landing page was created last week and the app was created before that. This is the one app that I was thinking of using later hope you like it.

--- 

With puretube you can search for videos, or paste a youtube video / playlist url to watch it instantly. You can also track your time spent watching videos and see your time and search history with this app. I have made this to be privacy friendly so that I don't get to collect any of your data that's why I have not linked a database or anything for this yet I will launch this on various platforms and if people like it I will just open source it. (As it still is now but I will not tell them that it's open source)

It took a lot of effort for me to create this app as it was my first time ever using youtube api service and GCP. There's also not a lot of tutorials on how to do build something like this (there are a lot on how to build todo list / notion's 😅) 

Most of my time went figuring out how to use the youtube api and how to get the videos with it. Later on to check if a pasted url is a youtube video or playlist url and then to get the video id and playlist id. I also had to figure out how to make the app responsive and also how to make it look good which is a crucial thing or why will peoplpe use it. ;) If you are a developer you can see the technical things yourself by clicking what this app uses. I would have wrote it here but it's a long list seeing this package.json file might help. 

In this app there are also a lot of different options that you can use, search filters if you want to see shorts or not (as you get shorts in youtube itself), recommend different videos or not etc. I have not added pip for this because this is meant for productivity not entertainment. Hope you get that also if you try to like remove or do other tasks while the video is playing in the app itself well it will be gone. You can see your history and watch time in the insights page. 

Also currently there are some issues with this app which are if you open multiple browsers the local data you see on the unsights page gets erased because it's not saving up the data properly in the browser or you can say not saving at all. This is also a work in progress which is why I did not want to use it for shipwrecked and would have completed it for neighborhood but here I am hope you liked the idea and it's something different than AI Slop and bullshit it took me a lot of time seriously to make this app. (50 hours approximately)

---

### Running it locally

First create a .env file with your Google Youtube API Key it should have the following content 

```
API_KEY="Your API Key"
```

then you can download and run the code simply using npm or bun 

```
npm install
npm run dev
```



