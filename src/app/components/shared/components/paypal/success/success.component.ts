import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const channel = new BroadcastChannel('succes-paypal-channel');

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html'
})
export class SuccessComponent {

  private readonly route = inject(ActivatedRoute);
  paymentId: string | null = null;
  PayerID: string | null = null;

  ngOnInit() {

    setTimeout(()=>{
      channel.postMessage({message: 'successPaypal'});
      this.onClose();

    }, 100);

  }

  onClose() {
    window.close();
  }

}
