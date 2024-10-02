import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {NgClass, NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {CardComponent} from "../../shared/components/card/card.component";

@Component({
  selector: "app-form-cards",
  templateUrl: "./form-cards.component.html",
  styleUrls: ["./form-cards.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    CardComponent,
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true
})
export class FormCardsComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);

  cardsForm: FormGroup = this.fb.group({
    cards: this.fb.array<FormGroup>([])
  })

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

  public submit(): void {}

  private getNewCardGroup(): FormGroup {
    return this.fb.group({
      country: ['', [Validators.required]],
      username: [''],
      birthday: [''],
    })
  }

  private initFirstCard(): void {
    this.cards.push(this.getNewCardGroup());
  }
}
