import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject, Observable} from 'rxjs';
import {Baid} from '../model/baid';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    public database: SQLiteObject;
    private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public foussoul = new BehaviorSubject([]);
    public fassil = new BehaviorSubject([]);
    private kalam = new BehaviorSubject([]);


    constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
        this.plt.ready().then(() => {

            if (!this.plt.is('mobileweb')) {
                this.sqlite.create({
                    name: 'burda.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    this.database = db;
                    this.seedDatabase();
                });
            }
        });
    }

    seedDatabase() {
        this.http.get('assets/seed.sql', {responseType: 'text'})
            .subscribe(sql => {
                this.sqlitePorter.importSqlToDb(this.database, sql)
                    .then(_ => {
                        this.dbReady.next(true);
                        this.getBaid();
                        this.getKalam(1);
                        console.log(this.foussoul);
                    })
                    .catch(e => console.error(e));
            });
    }

    getDatabaseState() {
        return this.dbReady.asObservable();
    }

    getBaid() {
        this.loadbaid();
        return this.foussoul;
    }

    async loadbaid() {

        const data = await this.database.executeSql('SELECT * FROM baid', []);
        const foussoul = [];
        console.log(data.rows.length + ' mht');

        if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
                foussoul.push({
                    id: data.rows.item(i).id,
                    title: data.rows.item(i).fassil,
                    url: 'folder/' + data.rows.item(i).id,
                    icon: 'medical'
                });
            }

        }
        console.log(foussoul);
        this.foussoul.next(foussoul);


    }

    getBaidOne(id) {
        this.loadbaidOne(id);
        console.log(this.fassil);
        return this.fassil;
    }


    async loadbaidOne(id) {

        const data = await this.database.executeSql('SELECT * FROM baid where id= ' + id, []);
        const fassil = [];
        console.log(data.rows.length + ' mahamat');

        if (data.rows.length > 0) {

            for (let i = 0; i < data.rows.length; i++) {
                fassil.push({
                    id: data.rows.item(i).id,
                    fassil: data.rows.item(i).fassil,
                });
            }
        }
        this.fassil.next(fassil);
    }

    getKalam(id) {
        this.loadKalam(id);
        return this.kalam;
    }

    async loadKalam(id) {

        const data = await this.database.executeSql('SELECT * FROM kalam where baid=' + id, []);
        const kalam = [];
        console.log(data.rows.length + ' mht');

        if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
                kalam.push({
                    id: data.rows.item(i).id,
                    text: data.rows.item(i).text,
                    text_fr: data.rows.item(i).text_fr,
                    couplet: data.rows.item(i).couplet,
                    baid: data.rows.item(i).baid
                });
            }

        }
        this.kalam.next(kalam);
    }
}
