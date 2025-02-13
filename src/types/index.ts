import { ReactNode } from "react";

export interface ModalObjectProps {
  isVisible: boolean;
}

export interface ObjectItem {
  [key: string]:
    | string
    | number
    | boolean
    | ObjectItem
    | ReactNode
    | ApiItem
    | PropertyValue
    | undefined;
}
export interface ExpandedStates {
  [key: string]: boolean;
}

export interface LoadingStates {
  [key: string]: boolean;
}

export interface ApiIntegrationValue {
  ref: string;
  apiUrl: string;
  [key: string]: string;
}

export type PropertyValue =
  | string
  | number
  | boolean
  | null
  | ApiIntegrationValue;

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
