import {Country} from "../../shared/enum/country.enum";

export const countryValidator = (control: { value: Country }): { [key: string]: boolean } | null => {
  if (control.value) {
    return Object.values(Country).includes(control.value) ? null : { invalidCountry: true };
  }

  return null;
}
