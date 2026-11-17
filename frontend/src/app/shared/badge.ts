import { Component, input } from '@angular/core';
import { STATUS_LABEL, Status } from '../core/models';

@Component({
  selector: 'app-badge',
  template: `<span class="badge {{ status() }}">{{ labels[status()] }}</span>`,
})
export class Badge {
  status = input.required<Status>();
  labels = STATUS_LABEL;
}
