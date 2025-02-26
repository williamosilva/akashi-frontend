import { ReactNode } from "react";

export interface ModalObjectProps {
  isVisible: boolean;
  projectId: string;
  itemKey: string;
  initialData?: Record<string, any>;
  onClose: (refresh: boolean) => void;
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

export type SubscriptionPlan = "free" | "basic" | "premium" | "admin";

export interface ApiResponse {
  error?: string;
  [key: string]: unknown;
}

export interface ApiIntegrationItemProps {
  propertyKey: string;
  value: ApiIntegrationValue;
  onValueChange: (key: string, value: ApiIntegrationValue) => void;
  onKeyChange: (oldKey: string, newKey: string) => void;
  onDeleteKey: (key: string) => void;
  editable?: boolean;
  error?: string;
  existingKeys?: string[];
}

export interface PropertyItemProps {
  propertyKey: string;
  displayKey?: string; // Nova propriedade opcional
  value: SimplePropertyValue;
  onValueChange: (key: string, value: PropertyValue) => void;
  onKeyChange: (oldKey: string, newKey: string) => void;
  onDeleteKey: (key: string) => void;
  error?: string; // Nova propriedade opcional
  isNew?: boolean;
}

export interface ObjectPropertiesProps {
  data: Record<string, unknown>;
  onUpdate: (updatedData: Record<string, unknown>) => void;
  isApiEditable?: boolean;
}

export interface ObjectActionsProps {
  onSave: () => void;
  onDelete: () => void;
  empty?: boolean;
  hasId?: boolean;
  isLoading?: boolean;
}

export interface ObjectHeaderProps {
  name: string;
  userPlan: SubscriptionPlan;
  sortAscending: boolean;
  setSortAscending: (value: boolean) => void;
  onApiIntegrationCreate: () => void;
  onSimpleObjectCreate: () => void;
  onNameChange?: (name: string) => void;
  empty?: boolean;
  isLoading?: boolean;
}

// Novo tipo para objetos dinâmicos com dois formatos
export interface DynamicIntegrationObject {
  [key: string]: SimplePropertyValue | ApiIntegrationObject;
}

// Interface para objetos de API com campos obrigatórios e dinâmicos
export interface ApiIntegrationObject {
  apiUrl: string;
  JSONPath: string;
  [key: string]: string; // Para campos dinâmicos como x-api-key
}
