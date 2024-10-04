import {
  ChangeDetectionStrategy,
  Component, DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal
} from "@angular/core";
import {DatePipe, NgClass} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

import {BtnAction} from "@shared/enum/btn-action.enum";
import {FormCardsService} from "../../form-cards.service";

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
export class HeaderComponent implements OnInit {
  @Input() amountInvalidCards: WritableSignal<number> = signal(0);
  @Input() msLeftBeforeRequest: WritableSignal<number> = signal(5000);
  @Input() isFormValid: WritableSignal<boolean> = signal(true);
  @Input() isFormSubmitted: WritableSignal<boolean> = signal(false);
  @Input() emptyForm: WritableSignal<boolean> = signal(false);

  @Output() onSubmit: EventEmitter<BtnAction> = new EventEmitter<BtnAction>();

  savedForm: boolean = false;

  readonly BtnAction = BtnAction;

  private readonly formCardsService: FormCardsService = inject(FormCardsService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.listenFormSaving();
  }

  public onClick(action: BtnAction): void {
    this.onSubmit.emit(action);
  }

  private listenFormSaving(): void {
    this.formCardsService.isFormSaved
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((saved: boolean) => {
        this.savedForm = saved;
      });
  }
}
