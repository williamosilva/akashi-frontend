import { ReactNode } from "react";

export interface ModalObjectProps {
  isVisible: boolean;
}

export interface ApiIntegrationValue {
  apiUrl: string;
  ref: string;
  [key: string]: string;
}

export type SimplePropertyValue = string | number | boolean | null | undefined;

export type PropertyValue = SimplePropertyValue | ApiIntegrationValue;

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

export interface ApiResponses {
  [key: string]: unknown;
}

export interface ApiItem {
  apiUrl: string;
  headerValue: string;
  ref?: string;
  [key: string]: string | undefined;
}

export type SubscriptionPlan = "free" | "basic" | "premium";
