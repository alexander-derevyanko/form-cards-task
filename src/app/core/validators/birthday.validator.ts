export const birthdayValidator = (control: { value: string }): { [key: string]: boolean } | null => {
  const today = new Date();
  const selectedDate = new Date(control.value);

  return selectedDate > today ? { invalidDate: true } : null;
}
