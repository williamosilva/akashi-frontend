export interface ModalObjectProps {
  isVisible: boolean;
}

export interface ObjectItem {
  [key: string]: string | number | boolean | ObjectItem | ReactNode | ApiItem;
}
export interface ExpandedStates {
  [key: string]: boolean;
}

export interface LoadingStates {
  [key: string]: boolean;
}

export interface ApiResponses {
  [key: string]: any;
}
export interface ApiItem {
  apiUrl: string;
  headerValue: string;
  ref?: string;
  [key: string]: string | undefined;
}

export type SubscriptionPlan = "free" | "basic" | "premium";
