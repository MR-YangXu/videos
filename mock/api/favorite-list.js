module.exports = (bizContent) => {
    return {
        code: 0,
        msg: "操作成功",
        success: true,
        data: {
            total: 1,
            list: [
                {
                    id: 43,
                    video_id: 2,
                    episode_num: 3,
                    created_at: 0,
                    video: {
                        id: 2,
                        title: "30 Days Till I Marry My Husband's Nemesis",
                        desc: "Blair Rose gets another chance in life after her husband murders her in cold blood. This time, she's out to teach him a lesson. The only thing she missed in her meticulous planning is falling in love with Nathan Forbes, the tall, handsome playboy heir to the Forbes family. Is this another mistake or her second chance at love?",
                        cover: "https://svedio.s3.amazonaws.com/test/image/0001/657c539736f92d4eae02f093.jpg",
                        total_episodes: 70
                    },
                    episode: {
                        id: 9,
                        video_id: 2,
                        episode_num: 3,
                        url: "https://svedio.s3.amazonaws.com/production/video/0001/657c539736f92d4eae02f093/2m6xl76e/7859e8626fdb4be195178db3b1c92977-01cef22fe02a50a75146c135eae7833c-ld.m3u8"
                    }
                }
            ]
        },
        debug_id: "e105837b-08de-4b25-9254-9a0707d5127c"
    }
};
