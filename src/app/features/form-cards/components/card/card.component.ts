import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  Signal,
  signal,
  WritableSignal
} from "@angular/core";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";

import {Country} from "@shared/enum/country.enum";
import {InputPromptComponent} from "@shared/components/input-prompt/input-prompt.component";
import {InputValidationDirective} from "@shared/directives/input-validation.directive";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
  @Input() disableRemove: WritableSignal<boolean> = signal(false);

  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  filteredCountries: Signal<string[]> = signal([]);

  private countryCtrlVal = signal<string | null>(null);
  private readonly countryEnum = Object.values(Country);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.listenCountryInputChange();
    this.filterCountriesWatcher();
  }

  public selectCountry(country: string): void {
    this.formGroup.get('country')?.setValue(country);
  }

  public onRemove(): void {
    this.remove.emit();
  }

  private listenCountryInputChange(): void {
    this.formGroup.get('country')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        const res = !value ? null : value;

        this.countryCtrlVal.set(res);
    });
  }

  private filterCountriesWatcher(): void {
    this.filteredCountries = computed(() => {
      return this.countryEnum.filter((country) => country.toLowerCase().includes(this.countryCtrlVal() as string));
    });
  }
}
