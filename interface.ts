// 向阳而生的闯关进度，可以在登录接口中返回
// 幸福社区的木材数量，可以在登录接口中返回



// 解锁二级建筑（新接口）
interface unlock {
    successed: boolean
}

// 幸福社区建筑内容接口
// 可以一次性吧所有的一级建筑和二级建筑一起返回
// 也可以分开两个接口（获取一级接口）（获取二级建筑接口）
interface Build {
    successed: boolean
    data: [
        // {
        //     id: 1,
        //     label: '商业区',
        //     imgSrc: 'http://lrj.com/miniassets/static/pages/happiness/title.png'
        // }
        {
            id: number,
            label: string,
            imgSrc: string
        }
        // ...more
    ]
}


// 从1开始
enum tree_status {
    '种子' = 1,
    '幼苗',
    '成长',
    '开花',
    '结果'
}
