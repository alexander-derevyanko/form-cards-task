import {Country} from "../../shared/enum/country";

export const countryValidator = (control: { value: Country }): { [key: string]: boolean } | null => {
  return Object.values(Country).includes(control.value) ? null : { invalidCountry: true };
}
