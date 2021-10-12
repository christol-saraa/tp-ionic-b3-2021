import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { of } from 'rxjs';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  imgSrc = [];

  constructor(private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

    of('pop')
      .pipe(delay(5000)).subscribe(val => console.log(`Fired 5s après l'abonnement`));

    console.log('Fired en premier');
  }

  openCamera() {
    Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    }).then (image => {
      console.log(`Fired au moment où l'uti selectionnera sa photo`);
      this.imgSrc.push('data:image/png;base64,' + image.base64String);
      console.log(this.imgSrc);
    });
  }
}
