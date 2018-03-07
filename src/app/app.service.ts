import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { Dialogs } from '@ionic-native/dialogs';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

declare let jQuery: any;
@Injectable()
export class AppService {
    platformName: string; //终端类型
    token: string; //用户token
    LoginUserInfo: any; //用户信息
    savePath: string = ''; //保存地址
    ctxPath: string; //服务器地址
    version: string; //app版本号
    version_code: number; //app版本code
    version_remark: string; //app版本功能描述
    unRefreshBookshelf: boolean = false; //是否刷新书架
    fileTransfer: FileTransferObject; //文件上传、下载
    loading: any; //加载对象
    updateBookInfoReviews: boolean = false;
    book_tiger: any; //定时器
    constructor(
        public loadingCtrl: LoadingController,
        public http: Http,
        public device: Device,
        public ngFile: File,
        public dialogs: Dialogs,
        public transfer: FileTransfer,
        public opener: FileOpener,
        public statusBar: StatusBar) {
        this.ctxPath = 'http://cjzww.cjszyun.cn';
    }
    //服务初始化
    init(callback?: any) {
        this.version = '2.2.6';
        this.version_code = 226;
        this.version_remark = '长江阅读APP发布!';
        this.platformName = this.device.platform ? this.device.platform.toLocaleLowerCase() : 'weixin';
        if (this.platformName != 'weixin') {
            //初始化文件对象
            this.fileTransfer = this.transfer.create();
            if (this.platformName == 'ios') {
                //文件存储路径
                this.savePath = this.ngFile.dataDirectory;
            }
            else {
                //文件存储路径
                this.savePath = this.ngFile.externalApplicationStorageDirectory;
            }
            //删除原来的目录
            //判断是否已经存在默认必须的3个文件路径  book  cover  user
            this.ngFile.checkDir(this.savePath + 'files/', 'book').then((success) => {
                console.log('存在book目录')
            }, (error) => {
                this.ngFile.createDir(this.savePath + 'files/', 'book', false)
            })
            this.ngFile.checkDir(this.savePath + 'files/', 'cover').then((success) => {
                console.log('存在cover目录')
            }, (error) => {
                this.ngFile.createDir(this.savePath + 'files/', 'cover', false)
            })
            this.ngFile.checkDir(this.savePath + 'files/', 'user').then((success) => {
                console.log('存在user目录')
            }, (error) => {
                this.ngFile.createDir(this.savePath + 'files/', 'user', false)
            })
        }

        this.LoginUserInfo = JSON.parse(localStorage.getItem('LoginUserInfo'));
        this.token = this.LoginUserInfo ? this.LoginUserInfo.token : null;
        if (callback) {
            callback();
        }
    }
    loadingStart(txt?: string) {
        if (!this.loading) {
            this.loading = this.loadingCtrl.create();
            this.loading.present();
        }
    }
    loadingEnd() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }
    getNetEork(): string{
        return 'wifi';
    }
    post(url: string, body?: any): Promise<any> {
        body = body ? body : {};
        body.token_type = this.platformName;
        body.member_token = this.token;
        body.client_type = 'DZ';
        url = url.indexOf('http://') == -1 || url.indexOf('https://') == -1 ? this.ctxPath + url : url;
        console.log(url)
        body = jQuery.param(body);
        console.log(body)
        //let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        //let options = new RequestOptions({headers: headers});
        return this.http.post(url, body).toPromise();
    }
    getUserInfo() {
        this.post('/v2/api/mobile/memberInfo').then(success => {
            let data = success.data;
            data.pwd = this.LoginUserInfo.pwd;
            data.token = this.LoginUserInfo.token;
            this.LoginUserInfo = data;
            //存储用户信息
            localStorage.setItem('LoginUserInfo', JSON.stringify(this.LoginUserInfo));
        })
    }
}