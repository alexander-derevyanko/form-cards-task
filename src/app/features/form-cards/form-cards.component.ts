import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from "@angular/core";
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

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

  cardsForm: FormGroup = this.fb.group({
    cards: this.fb.array<FormGroup>([])
  });

  amountInvalidCards: number = 0;

  secondsLeftBeforeRequest: WritableSignal<number> = signal(5000);
  isFormValid: WritableSignal<any> = signal(true);
  isFormSubmitted: WritableSignal<any> = signal(false);

  // TODO: typing
  get cards(): any {
    return this.cardsForm.get('cards') as any;
  }

  ngOnInit(): void {
    this.initFirstCard();
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
}
