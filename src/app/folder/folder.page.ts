import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatabaseService} from '../services/database.service';
import {Content} from '@angular/compiler/src/render3/r3_ast';
import {IonContent} from '@ionic/angular';

@Component({
    selector: 'app-folder',
    templateUrl: './folder.page.html',
    styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
    public folder: string;
    public id = 1;
    private foussoul;
    public fassil;
    public kalam;
    public trans = false;
    private type = 'outline';
    private st: boolean;

    // @ts-ignore
    @ViewChild(IonContent) content: IonContent;

    scrollToTop() {
        this.content.scrollToTop();
    }
    ionViewDidEnter() {
        this.scrollToTop();
    }

    constructor(private activatedRoute: ActivatedRoute, private db: DatabaseService) {
    }

    ngOnInit() {
        if (this.db.getDatabaseState()) {
            this.folder = this.activatedRoute.snapshot.paramMap.get('id');
            this.id = parseFloat(this.folder);

            this.chargeDonnee();
        }


    }

    chargeDonnee() {

        this.db.getBaid().subscribe(foussl => {
            this.foussoul = foussl;
            this.fassil = this.foussoul[this.id - 1];
            console.log('Waouh' + this.fassil.fassil);
        });

        this.db.getKalam(this.id).subscribe(kalm => {
            this.kalam = kalm;
            // console.log(this.kalam);
        });
    }

    chanetrans() {
        this.trans = !this.trans;
        if (this.trans === true) {
            this.type = 'sharp';
        } else {
            this.type = 'outline';
        }
    }

    loadData(event, opt) {

        console.log('Done');


        // App logic to determine if all data is loaded
        if (opt === 1) {
            if (this.id < 10) {
                this.id++;
            } else {
                alert('Impossible!  Vous êtes déjà à la dernière page');
                return;
            }
        } else {
            if (this.id > 1) {
                this.id--;
            } else {
                alert('Impossible!  Vous êtes déjà à la première page');
                return;
            }
        }
        this.chargeDonnee();
        this.scrollToTop();
    }
}
