export const birthdayValidator = (control: { value: string }): { [key: string]: boolean } | null => {
  if (control.value) {
    const today = new Date();
    const selectedDate = new Date(control.value);

    return selectedDate > today ? { invalidDate: true } : null;
  }

  return null;
}
