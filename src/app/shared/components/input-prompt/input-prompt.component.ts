import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal} from "@angular/core";

@Component({
  selector: 'app-input-prompt',
  templateUrl: './input-prompt.component.html',
  styleUrls: ['./input-prompt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class InputPromptComponent {
  @Input() list: Signal<string[]>;

  @Output() onSelected: EventEmitter<string> = new EventEmitter<string>();

  public selectItem(item: string): void {
    this.onSelected.emit(item);
  }
}
