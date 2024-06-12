require('dotenv').config();
const { Client, CustomStatus, SpotifyRPC } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');
const client = new Client();

client.once("ready", async () => {
    console.log("StatusBot is Ready!\n" + client.guilds.cache.size + "サーバーに参加中\n" + client.channels.cache.size + "チャンネル、" + client.users.cache.size + "ユーザーを監視中です");
    client.user.setStatus("idle");
    const custom = new CustomStatus(client).setState('This is Custom Status');

    const songs = [
        {
            largeImage: 'spotify:ab67616d00001e02a113e45b6f03eccf7c284d21', //spotify:より後のイメージをspotifyからパクってくる
            largeText: '欠けた心象、世のよすが', //アルバム名
            state: '月詠み', //アーティスト名
            details: 'こんな命がなければ', //曲名
            duration: 3 * 60 + 57, // 3m57s要は再生時間
            songId: '0tSUB6sMMUi014X7YISk7w', //曲のID(URLのやつでおｋ)
            albumId: '1VT0ZKjq4T38hJqX815Dga', //アルバムのID
            artistIds: '2mcj8ajoE1eFlNkAihw5Cg' //アーティストID
        },
    ];

    let currentSongIndex = 0;

    const updateSpotifyRPC = () => {
        const song = songs[currentSongIndex];
        const spotify = new SpotifyRPC(client)
            .setAssetsLargeImage(song.largeImage)
            .setAssetsLargeText(song.largeText)
            .setState(song.state)
            .setDetails(song.details)
            .setStartTimestamp(Date.now())
            .setEndTimestamp(Date.now() + 1_000 * song.duration)
            .setSongId(song.songId)
            .setAlbumId(song.albumId)
            .setArtistIds(song.artistIds);

        client.user.setPresence({ activities: [custom , spotify] });

        currentSongIndex = (currentSongIndex + 1) % songs.length;
        setTimeout(updateSpotifyRPC, 1_000 * song.duration);
    };

    // 初回呼び出し
    updateSpotifyRPC();
});
client.on("messageCreate", async message => {
    // コマンドの使用を許可するユーザー
    const OwnerUserId = '147138764194447360';

    if (message.content === ';;stop statusbot') {
        if (message.author.id === OwnerUserId) {
            message.react('✅').then(() => {
                process.exit(1);
            }).catch(error => {
                message.react('❌');
            });
        } else {
        }
    }
});

client.login(process.env.TOKEN);
