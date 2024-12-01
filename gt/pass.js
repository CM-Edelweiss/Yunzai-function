/**
 * 自己搓一个
 * https://github.com/CM-Edelweiss/Yunzai-function/gt
 */

import MysApi from './mysApi.js'


export default class pass {

    static async gt(gt, challenge) {

        let url = ''; // 链接地址
        let token = '' // 验证token

        if (token) {
            url += `?token=${token}&gt=${gt}&challenge=${challenge}`
        } else {
            url += `?gt=${gt}&challenge=${challenge}`
        }
        let res = await fetch(url, {
            method: 'GET',

            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000
        })
        if (!res.ok) {
            logger.error(`[pass][链接失败] [${res.status}]`)
            return false
        } else {
            const data = await res.json()
            if (data.code == 0 && data.data) {
                logger.mark(`[pass][获取成功] [${data.data.validate}]`)
                return data.data

            } else {
                logger.error(`[pass][获取失败] [${data.code}] [${data.msg}]`)
                return false
            }
        }
    }

    static async mys_up(type, uid, ck, e) {
        let _MysApi = new MysApi(uid, ck, {}, e.isSr);

        let handler = _MysApi.getHeaders();

        if (e.is_sr) {
            handler['x-rpc-challenge_game'] = '6'
            handler['x-rpc-page'] = 'v1.4.1-rpg_#/rpg'
            handler['x-rpc-tool-verison'] = 'v1.4.1-rpg'
        } else {
            handler['x-rpc-challenge_game'] = '2'
            handler['x-rpc-page'] = 'v4.1.5-ys_#ys'
            handler['x-rpc-tool-verison'] = 'v4.1.5-ys'
        }

        let hostRecord = 'https://api-takumi-record.mihoyo.com/'

        handler.DS = _MysApi.getDs('is_high=false', '');
        handler.Cookie = ck;
        let res2 = await fetch(`${hostRecord}game_record/app/card/wapi/createVerification?is_high=false`, {
            method: 'GET',
            headers: handler
        });
        if (!res2.ok) {
            logger.error(`[pass][链接失败] [${res2.status}]`)
            return false
        }
        const data = await res2.json();
        if (data.challenge) {
            logger.mark('[pass] gt获取成功');
        }

        let gt = await this.gt(data.data.gt, data.data.challenge);
        let va = gt.validate;
        let ch = gt.challenge;
        let ds = {
            'geetest_challenge': ch,
            'geetest_validate': va,
            'geetest_seccode': va + '|jordan',
        };
        handler.DS = _MysApi.getDs('', ds);
        let res1 = await fetch(`${hostRecord}game_record/app/card/wapi/verifyVerification`,
            {
                method: 'POST',
                headers: handler,
                body: JSON.stringify(ds)
            });
        if (!res1.ok) {
            logger.error(`[pass][链接失败] [${res1.status}]`)
            return false
        }
        const re = await res1.json()
        if (re.retcode == 0) {
            logger.mark(`[pass][验证码验证成功]`)
        } else {
            logger.error(`[pass][验证码验证失败] [${re.data}]`)
            return false
        }
        const headers = {
            "x-rpc-challenge": ch
        }
        let hd = { headers }
        return _MysApi.getData(type, hd, false)
    }
}
