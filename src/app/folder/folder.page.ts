import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Camera, CameraResultType} from '@capacitor/camera';
import {LoadingController} from '@ionic/angular';
import {map} from 'rxjs/operators';
import {Todo, User} from '../models';
import {TodosService} from '../services/todos.service';
import {UsersService} from '../services/users.service';

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
              private loadingController: LoadingController,
              private usersSerice: UsersService,
              private todosService: TodosService) {
  }

  async ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    this.usersSerice.get()
      .subscribe((users) => {
        this.users = users;
        const promTodos = [];

        this.users.forEach(user => {
          promTodos.push(this.todosService.getByUserId(user.id).toPromise());
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
