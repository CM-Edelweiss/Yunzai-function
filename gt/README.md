# 过码插件
## 安装
1. 下载插件到放置到`Yunzai\plugins\genshin\model\mys`
- 填入过码地址
```
export default class pass {

    static async gt(gt, challenge) {
        //填入过码地址
        let url = ''; // 链接地址
        let token = '' // 验证token

        ...
```

2. 修改`Yunzai\plugins\genshin\model\mys\mysInfo.js`文件
- 导入
```
import MysUser from './MysUser.js'
import DailyCache from './DailyCache.js'

// 引入过码插件
import pass from './pass.js'

```
- 替换原函数
```
    case 1034:
    case 10035:
    // 使用过码
    res = await pass.mys_up(type,this.uid,this.ckInfo.ck,this.e)
    if (!res || res?.retcode == 1034) {
        logger.mark(`[米游社查询失败][uid:${this.uid}][qq:${this.userId}] 遇到验证码`)
        if (!isTask) this.e.reply([`UID:${this.uid}，米游社查询遇到验证码，请稍后再试`, this.mysButton])
    }
    break
    case 10307:
```