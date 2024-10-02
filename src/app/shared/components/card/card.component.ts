import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {AbstractControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule
  ],
  standalone: true
})
export class CardComponent {
  @Input() formGroup!: any;

  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  onRemove() {
    this.remove.emit();
  }
}
