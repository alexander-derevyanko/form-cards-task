export const birthdayValidator = (control: { value: string }): { [key: string]: boolean } | null => {
  const today = new Date();
  const selectedDate = new Date(control.value);

  if (selectedDate > today) {
    return { invalidDate: true };
  }

  return null;
}
