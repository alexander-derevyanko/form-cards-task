import {AbstractControl, AsyncValidatorFn} from "@angular/forms";
import {map, of, switchMap, timer} from "rxjs";

import {CheckUserResponseData} from "../interface/responses";
import {FormCardsApiService} from "../../features/form-cards/form-cards-api.service";

export const usernameValidator = (usernameService: FormCardsApiService): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (control.value) {
      return timer(300)
        .pipe(
          switchMap(() => usernameService.checkUsername(control.value)
            .pipe(
              map((result: CheckUserResponseData) => result.isAvailable ? null : { usernameTaken: true })
            )
          )
        );
    }

    return of(null);
  };
}
