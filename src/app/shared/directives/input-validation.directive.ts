import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  Renderer2,
} from "@angular/core";
import {AbstractControl, FormControlStatus} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter} from "rxjs";

import {FormCtrlStatus} from "../enum/form-ctrl-status.enum";

@Directive({
  selector: '[appInputValidation]',
  standalone: true,
})
export class InputValidationDirective implements OnChanges {
  @Input() control!: AbstractControl | null;
  @Input() errorType!: string;

  private errorElement!: HTMLElement | null;

  private readonly handlers: {[key: string]: Function } = {
    [FormCtrlStatus.Invalid]: this.handleInvalidCase.bind(this),
    [FormCtrlStatus.Valid]: this.handleValidCase.bind(this)
  }

  private readonly elementRef: ElementRef = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    if (this.control) {
      this.control.statusChanges
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter((status: FormControlStatus) => status === FormCtrlStatus.Valid || status === FormCtrlStatus.Invalid)
        )
        .subscribe((status: FormControlStatus) => this.handlers?.[status]());
    }
  }

  private handleValidCase(): void {
    this.renderer.removeClass(this.elementRef.nativeElement, 'is-invalid');
    this.removeErrorMsg();
  }

  private handleInvalidCase(): void {
    this.renderer.addClass(this.elementRef.nativeElement, 'is-invalid');
    this.showErrorMsg();
  }

  private showErrorMsg(): void {
    if (!this.errorElement) {
      this.errorElement = this.renderer.createElement('div');

      this.renderer.setAttribute(this.errorElement, 'class', 'form-text text-danger')
      this.renderer.setProperty(this.errorElement, 'innerText', this.getErrorMsg());
      this.renderer.setProperty(this.errorElement, 'id', this.errorType.toLowerCase());

      this.renderer.insertBefore(this.elementRef.nativeElement.parentNode, this.errorElement, this.elementRef.nativeElement.nextSibling);
    }
  }

  private removeErrorMsg(): void {
    if (this.errorElement) {
      this.renderer.removeChild(this.elementRef.nativeElement.parentNode, this.errorElement);
      this.errorElement = null;
    }
  }

  // could be configurable from outer scope however in this case I decided to leave it in the directive directly
  private getErrorMsg(): string | null {
    return `Please provide a correct ${this.errorType}`;
  }
}
