export interface RedocProps {
  spec?: object;
  specUrl?: string;
  options?: RedocRawOptions;
  onLoaded?: (e?: Error) => any;
}
