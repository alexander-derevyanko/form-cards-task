import {AbstractControl, AsyncValidatorFn} from "@angular/forms";
import {map, switchMap, timer} from "rxjs";

import {CheckUserResponseData} from "../../shared/interface/responses";
import {FormCardsApiService} from "../../features/form-cards/form-cards-api.service";

export const usernameValidator = (usernameService: FormCardsApiService): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    return timer(300)
      .pipe(
        switchMap(() => usernameService.checkUsername(control.value)
          .pipe(
            map((result: CheckUserResponseData) => result.isAvailable ? null : { usernameTaken: true })
          )
        )
    );
  };
}
