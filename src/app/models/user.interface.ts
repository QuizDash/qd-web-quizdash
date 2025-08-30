export interface IUser {
  user_id: string;
  family_name: string;
  given_name: string;
  email: string;
  phone_number: string;
  groups: string[];
  email_verified: boolean;
  status: string;
  created_on_utc: any;
  created_on_utc_display: string;
  last_updated_utc: any;
}
