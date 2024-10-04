import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, WritableSignal} from "@angular/core";
import {DatePipe, NgClass} from "@angular/common";

import {BtnAction} from "@shared/enum/btn-action.enum";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgClass
  ],
  standalone: true
})
export class HeaderComponent {
  @Input() amountInvalidCards: WritableSignal<number> = signal(0);
  @Input() msLeftBeforeRequest: WritableSignal<number> = signal(5000);
  @Input() isFormValid: WritableSignal<any> = signal(true);
  @Input() isFormSubmitted: WritableSignal<any> = signal(false);

  @Output() onSubmit: EventEmitter<BtnAction> = new EventEmitter<BtnAction>();

  readonly BtnAction = BtnAction;

  public onClick(action: BtnAction): void {
    this.onSubmit.emit(action);
  }
}
