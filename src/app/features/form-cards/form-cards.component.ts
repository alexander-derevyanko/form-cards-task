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
import {FormBuilder, FormControl, FormControlStatus, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter, map, Observable, Subscription, take, tap, timer} from "rxjs";

import {CardComponent} from "../../shared/components/card/card.component";
import {birthdayValidator} from "../../core/validators/birthday.validator";
import {countryValidator} from "../../core/validators/country.validator";
import {usernameValidator} from "../../core/validators/username.validator";
import {FormCardsApiService} from "./form-cards-api.service";
import {FormCardsService} from "./form-cards.service";

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
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly formCardsApiService: FormCardsApiService = inject(FormCardsApiService);
  private readonly formCardsService: FormCardsService = inject(FormCardsService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  cardsForm: FormGroup = this.fb.group({
    cards: this.fb.array<FormGroup>([])
  });

  amountInvalidCards: number = 0;

  msLeftBeforeRequest: WritableSignal<number> = signal(5000);
  isFormValid: WritableSignal<any> = signal(true);
  isFormSubmitted: WritableSignal<any> = signal(false);

  private timerSubscription: Subscription | null = null;

  // TODO: typing
  get cards(): any {
    return this.cardsForm.get('cards') as any;
  }

  ngOnInit(): void {
    this.initFirstCard();
    this.listenFormStatus(); // reset disabled submit btn after form is valid
    console.log(this.cardsForm);
  }

  public addCard(): void {
    if (this.cards.length > 9) return;

    this.cards.push(this.getNewCardGroup());
  }

  public removeCard(index: number): void {
    this.cards.removeAt(index);
  }

  public submit(): void {
    console.log('form', this.cardsForm);
    console.log('submit', this.cardsForm.getRawValue());

    if (!this.cardsForm.valid) {
      this.validateCards();

      return;
    }

    this.isFormSubmitted.set(true);
    this.enableDisableCtrl('disable');
    this.timerSubscription = this.startTimer()
      .pipe(
        tap((secondsLeft: number) => this.msLeftBeforeRequest.set(secondsLeft * 1000))
      )
      .subscribe({
        complete: (): void => {
          this.isFormSubmitted.set(false);
          this.enableDisableCtrl('enable');
          this.cardsForm.reset();
          this.formCardsApiService.submitForm(this.cardsForm.getRawValue()).subscribe((res: any) => console.log('RESULT: ', res));
        },
      });
  }

  // TODO: move to utils and make generic
  public startTimer(): Observable<number> {
    return timer(0, 1000)
      .pipe(
        take(6),
        map((secondsElapsed: number) => 5 - secondsElapsed)
      )
  }

  public cancel(): void {
    console.log('!!! CANCEL');
    this.isFormSubmitted.set(false);
    this.enableDisableCtrl('enable');
    this.stopTimer();
  }

  private validateCards(): void {
    Object.values(this.cards['controls']).forEach((item: any) => {
      const controls = Object.values(item['controls']);

      controls.forEach((control: any) => {
        control.updateValueAndValidity();
        control.markAsTouched();
      });
    });

    this.isFormValid.set(false);
    this.amountInvalidCards = this.cards['controls'].filter((el: any) => el.status === 'INVALID').length;
  }

  private stopTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.msLeftBeforeRequest.set(5000);
  }

  private enableDisableCtrl(action: 'enable' | 'disable'): void {
    Object.values(this.cards['controls']).forEach((item: any) => {
      const controls: FormControl[] = Object.values(item['controls']);

      controls.forEach((control: FormControl) => {
        control[action]()
      });
    });
  }

  private getNewCardGroup(): FormGroup {
    return this.fb.group({
      country: ['', [Validators.required, countryValidator]],
      username: ['', [Validators.required], [usernameValidator(this.formCardsApiService)]],
      birthday: ['', [Validators.required, birthdayValidator]],
    })
  }

  private initFirstCard(): void {
    this.cards.push(this.getNewCardGroup());
  }

  private listenFormStatus(): void {
    this.cardsForm.statusChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((status) => status === 'VALID' || status === 'INVALID')
      )
      .subscribe((status: FormControlStatus) => {
        console.log('!!!! status', status);
        this.isFormValid.set(status === 'VALID');
      });
  }
}
