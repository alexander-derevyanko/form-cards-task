import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Signal,
  signal
} from "@angular/core";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";

import {Country} from "../../enum/country";
import {InputPromptComponent} from "../input-prompt/input-prompt.component";
import {InputValidationDirective} from "../../directives/input-validation.directive";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputPromptComponent,
    InputValidationDirective
  ],
  standalone: true
})
export class CardComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() idx!: number;

  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  filteredCountries: Signal<string[]> = signal([]);

  private countryCtrlVal = signal<string | null>(null);
  private readonly countryEnum = Object.values(Country);

  ngOnInit(): void {
    this.listenCountryInputChange();

    this.filteredCountries = computed(() => {
      return this.countryEnum.filter((country) => country.toLowerCase().includes(this.countryCtrlVal() as string));
    });
  }

  public selectCountry(country: string): void {
    this.formGroup.get('country')?.setValue(country);
  }

  public onRemove(): void {
    this.remove.emit();
  }

  private listenCountryInputChange(): void {
    this.formGroup.get('country')?.valueChanges
      .subscribe((value: any) => {
        const res = !value ? null : value;

        this.countryCtrlVal.set(res);
    });
  }
}
