export class Feedback {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  agree: boolean;
  contactType: string;
  message: string;
}

export const contactType = ['None', 'Tel', 'Email'];
