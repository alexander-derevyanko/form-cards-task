import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal
} from "@angular/core";
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {FormControl, FormControlStatus, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter, Observable, of, Subscription, switchMap, tap} from "rxjs";

import {CardComponent} from "../../shared/components/card/card.component";
import {FormCardsApiService} from "./form-cards-api.service";
import {FormCardsService} from "./form-cards.service";
import {FormCtrlStatus} from "../../shared/enum/form-ctrl-status.enum";
import {CtrlAccessState} from "../../shared/enum/ctrl-access-state.enum";
import {countdownTimer} from "../../shared/utils/countdown-timer";
import {SubmitFormResponseData} from "../../shared/interface/responses";

@Component({
  selector: "app-form-cards",
  templateUrl: "./form-cards.component.html",
  styleUrls: ["./form-cards.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    CardComponent,
    ReactiveFormsModule,
    NgForOf,
    DatePipe
  ],
  providers: [FormCardsApiService, FormCardsService],
})
export class FormCardsComponent implements OnInit {
  cardsForm!: FormGroup;

  amountInvalidCards: WritableSignal<number> = signal(0);
  msLeftBeforeRequest: WritableSignal<number> = signal(5000);
  isFormValid: WritableSignal<any> = signal(true);
  isFormSubmitted: WritableSignal<any> = signal(false);

  private timerSubscription: Subscription | null = null;

  private readonly formCardsApiService: FormCardsApiService = inject(FormCardsApiService);
  private readonly formCardsService: FormCardsService = inject(FormCardsService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  // TODO: typing
  get cards(): any {
    return this.cardsForm.get('cards') as any;
  }

  ngOnInit(): void {
    this.cardsForm = this.formCardsService.getCardsForm();

    this.listenFormStatus(); // reset disabled submit btn after form is valid
  }

  public addCard(): void {
    if (this.cards.length > 9) return;

    this.formCardsService.addCard();

    // technically all new added forms are INVALID by default since we init Validators.required
    // it does make sense to change counter so as not to mislead the user
    if (this.amountInvalidCards() > 0 && !this.isFormValid()) {
      this.amountInvalidCards.set(this.formCardsService.getAmountInvalidCards());
    }
  }

  public removeCard(index: number): void {
    this.formCardsService.removeCard(index);
  }

  public submit(): void {
    console.log('form', this.cardsForm);
    console.log('submit', this.cardsForm.getRawValue());

    if (!this.cardsForm.valid) {
      this.validateCards();

      return;
    }

    this.isFormSubmitted.set(true);
    this.enableDisableCtrl(CtrlAccessState.Disable);
    this.saveData();
  }

  public cancel(): void {
    this.isFormSubmitted.set(false);
    this.enableDisableCtrl(CtrlAccessState.Enable);
    this.stopTimer();
  }

  private saveData(): void {
    this.timerSubscription = countdownTimer(5)
      .pipe(
        tap((secondsLeft: number) => this.msLeftBeforeRequest.set(secondsLeft * 1000)),
        switchMap((secondsLeft: number) => {
          if (secondsLeft === 0) {
            return this.formCardsApiService.submitForm(this.cardsForm.getRawValue()) as Observable<SubmitFormResponseData>;
          }

          return of({} as SubmitFormResponseData);
        }),
        filter((res: SubmitFormResponseData) => Object.values(res).length > 0),
      )
      .subscribe({
        next: (res: SubmitFormResponseData): void => console.info('RESULT: ', res),
        complete: (): void => {
          this.isFormSubmitted.set(false);
          this.enableDisableCtrl(CtrlAccessState.Enable);
          this.formCardsService.resetFullyForm();
          this.amountInvalidCards.set(this.formCardsService.getAmountInvalidCards());
        },
      });
  }

  private validateCards(): void {
    this.isFormValid.set(false);
    this.amountInvalidCards.set(this.formCardsService.getAmountInvalidCards());
    this.formCardsService.handleEachCtrl((ctrl: FormControl) => {
      ctrl.updateValueAndValidity();
      ctrl.markAsTouched();
    });
  }

  private stopTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.msLeftBeforeRequest.set(5000);
  }

  private enableDisableCtrl(action: CtrlAccessState): void {
    this.formCardsService.handleEachCtrl((ctrl: FormControl) => ctrl[action]());
  }

  private listenFormStatus(): void {
    this.cardsForm.statusChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((status) => status === FormCtrlStatus.Valid || status === FormCtrlStatus.Invalid)
      )
      .subscribe((status: FormControlStatus) => {
        console.log('!!!! status', status);
        this.isFormValid.set(status === FormCtrlStatus.Valid);
      });
  }
}
