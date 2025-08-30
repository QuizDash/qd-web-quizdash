export interface ISubject {
  name: string;
  label: string;
  categories: ICategory[];
}

export interface ICategory {
  value: string;
}
