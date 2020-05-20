import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {DatabaseService} from './services/database.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})


export class AppComponent implements OnInit {
    public selectedIndex = 0;
    public foussoul;
    public appPages = [];

    public labels = ['Hamzia'];
    private fassil: any;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private db: DatabaseService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            if (!this.platform.is('mobileweb')) {

                //   this.db.loadVilles();
                this.db.getBaid().subscribe(foussl => {
                    this.foussoul = foussl;
                    this.fassil = this.foussoul.length;
                });
            }
        });
    }

    ngOnInit() {

        // tslint:disable-next-line:prefer-for-of


        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }
    }
}
