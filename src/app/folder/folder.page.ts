import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Camera, CameraResultType} from '@capacitor/camera';
import {LoadingController} from '@ionic/angular';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  imgSrc = [];

  users: User[];

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private loadingController: LoadingController) {
  }

  async ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    this.http.get<User[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe((users) => {
        this.users = users;
        const promTodos = [];

        this.users.forEach(user => {
          promTodos.push(this.http
            .get<Todo[]>(`https://jsonplaceholder.typicode.com/todos?userId=${user.id}`).toPromise());
        });

        Promise.all(promTodos)
          .then(values => {
            this.users.forEach((user, index) => {
              user.todos = values[index];
            });
            loading.dismiss();
        });
      });
  }

  async openCamera() {
    try {

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });
      console.log(`Fired au moment où l'uti selectionnera sa photo`);
      this.imgSrc.push('data:image/png;base64,' + image.base64String);
      console.log(this.imgSrc);
    } catch (err) {
      console.info(err);
    }
  }

  statusTodoCheck(todos: Todo[]) {
    return {
      checked: todos.filter(todo => todo.completed).length,
      unChecked: todos.filter(todo => !todo.completed).length
    };
  }
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;

  todos: Todo[];
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}
