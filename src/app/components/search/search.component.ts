import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InstanceOptions, Modal, ModalInterface, ModalOptions } from 'flowbite';
import { SearchModalComponent } from 'src/app/modals/search-modal/search-modal.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  canShowModal: boolean = false;
  modalCtrl = inject(ModalController);

  ngOnInit() { }

  async handleModalToggle() {
    this.canShowModal = true;
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      cssClass: 'search-modal'
    });
    console.log('>>>>> modal : ', modal);
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log('data: ', data);
    console.log('role: ', role);


  }


}
