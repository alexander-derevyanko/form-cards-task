import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {NgClass, NgForOf} from "@angular/common";

import {CardComponent} from "../../shared/components/card/card.component";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

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

  cards: FormArray = this.fb.array([]);

  ngOnInit(): void {
    this.initFirstCard();
  }

  public addCard(): void {
    if (this.cards.length > 9) return;

    const formGroup = this.fb.group({
      country: [''],
      username: [''],
      birthday: [''],
    });

    this.cards.push(formGroup);
  }

  public removeForm(index: number): void {
    this.cards.removeAt(index);
  }

  public submit(): void {
    console.log(this.cards.value);
  }

  private initFirstCard(): void {
    const formGroup = this.fb.group({
      country: [''],
      username: [''],
      birthday: [''],
    });

    this.cards.push(formGroup);
  }

  protected readonly FormGroup = FormGroup;
}
