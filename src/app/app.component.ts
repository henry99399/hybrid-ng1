import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppService } from './app.service';
import { TabsPage } from '../pages/tabs/tabs';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  constructor(platform: Platform, private service: AppService, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.service.init(() => {
        //判断是否有网络
        if (this.service.getNetEork() != 'none' || this.service.platformName == 'weixin') {
          let param = {
            account: new Date().getTime(),
            pwd: '123456'
          }
          if (this.service.LoginUserInfo) {
            param.account = this.service.LoginUserInfo.account;
            param.pwd = this.service.LoginUserInfo.pwd;
            //重新登录
            this.login(param);
          }
          else {
            this.registe(param);
          }
        }
        else {
          this.service.unRefreshBookshelf = true;
          //隐藏启动页
          this.splashScreen.hide();
        }
      })
    });
  }
  //注册
  registe(param: any) {
    this.service.post("/v2/api/mobile/registe", param).then(success => {
      console.log(success)
      this.login(param);
    })
  }

  //登录
  login(param: any) {
    this.service.post('/v2/api/mobile/login', param).then(success => {
      console.log(success)
      if (success.code == 0) {
        this.service.LoginUserInfo = success.data;
        this.service.LoginUserInfo.pwd = param.pwd;
        this.service.token = success.data.token;
        //存储用户信息
        localStorage.setItem('LoginUserInfo', JSON.stringify(this.service.LoginUserInfo));
        this.service.unRefreshBookshelf = true;
        //隐藏启动页
        this.splashScreen.hide();
      }
      else {
        localStorage.removeItem('LoginUserInfo');
        this.service.LoginUserInfo = null;
        this.service.unRefreshBookshelf = true;
        //隐藏启动页
        this.splashScreen.hide();
      }
    })
  }
}
