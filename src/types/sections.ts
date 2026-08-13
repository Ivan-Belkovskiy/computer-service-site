export type PropType = 'text' | 'textarea' | 'image' | 'boolean' | 'number';

export interface PropSchemaField {
  key: string;       
  label: string;     
  type: PropType;    
  required?: boolean;
  defaultValue?: string | boolean | number;
}

export type CustomSectionSchema = PropSchemaField[];