import {inject, Injectable} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

import {countryValidator} from "@shared/validators/country.validator";
import {usernameValidator} from "@shared/validators/username.validator";
import {birthdayValidator} from "@shared/validators/birthday.validator";
import {FormCtrlStatus} from "@shared/enum/form-ctrl-status.enum";
import {FormCardsApiService} from "./form-cards-api.service";

@Injectable()
export class FormCardsService {
  // need to prevent directive from marking controls as invalid after saving data
  readonly isFormSaved: BehaviorSubject<any> = new BehaviorSubject(false);

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly formCardsApiService: FormCardsApiService = inject(FormCardsApiService);

  private readonly cardsForm: FormGroup = this.fb.group({
    cards: this.fb.array<FormGroup>([])
  });

  // TODO: typing
  get cards(): any {
    return this.cardsForm.get('cards') as any;
  }

  public getCardsForm(): FormGroup {
    this.addCard(); // initialise first card

    return this.cardsForm;
  }

  public handleEachCtrl(cb: Function): void {
    Object.values(this.cards['controls']).forEach((item: any) => {
      const controls: FormControl[] = Object.values(item['controls']);

      controls.forEach((control: FormControl) => cb(control));
    });
  }

  public addCard(): void {
    this.cards.push(this.getNewCardGroup());
  }

  public removeCard(index: number): void {
    this.cards.removeAt(index);
  }

  public resetFullyForm(): void {
    this.cardsForm.reset();
    this.cardsForm.markAsUntouched();
    this.cardsForm.markAsPristine();
  }

  public getAmountInvalidCards(): number {
    return this.cards['controls'].filter((ctrl: FormControl) => ctrl.status === FormCtrlStatus.Invalid).length;
  }

  private getNewCardGroup(): FormGroup {
    return this.fb.group({
      country: ['', [Validators.required, countryValidator]],
      username: ['', [Validators.required], [usernameValidator(this.formCardsApiService)]],
      birthday: ['', [Validators.required, birthdayValidator]],
    })
  }
}
