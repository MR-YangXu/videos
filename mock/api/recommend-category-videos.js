module.exports = (bizContent) => {
    return {
        code: 0,
        msg: "操作成功",
        success: true,
        data: {
            category: {
                id: 1,
                name: "Genius Babies"
            },
            list: [
                {
                    video_id: 1,
                    title: "OMG! You're My Baby Daddy!",
                    cover: "https://svedio.s3.amazonaws.com/test/image/0001/6544b146addfbb749b077486.jpg?x-oss-process=image/resize,w_150/quality,q_85",
                    total_episodes: 68,
                    tag_list: [
                        "Genius Babies",
                        "Genres",
                        "Male Identities",
                        "MC",
                        "Female Personalities",
                        "Sweet",
                        "Background",
                        "Actor",
                        "Actress"
                    ]
                },
                {
                    video_id: 8,
                    title: "Test_mp4",
                    cover: "https://os-svideo.oss-cn-hongkong.aliyuncs.com/video_cover/2024/04/30/QgMlNKcwjcPTgWI8l4JSgVwWgC-SMaAC.png?x-oss-process=image/resize,w_150/quality,q_85",
                    total_episodes: 2,
                    tag_list: [
                        "Test_mp4"
                    ]
                }
            ],
            total: 2
        },
        debug_id: "f35825c4-1f24-4c9e-a8d1-7fe449f397f3"
    }
};
  