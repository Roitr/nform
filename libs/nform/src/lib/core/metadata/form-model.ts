import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { isJsObject } from '@pebula/utils';
import { MetaClass, PropMetadata, ModelMetadata, BaseMetadata, DecoratorInfo } from '@pebula/utils/meta/internal';

import { FormPropMetadata } from './form-prop';

export interface FormModelMetadataArgs {
  validator?: ValidatorFn;
  asyncValidator?: AsyncValidatorFn;
}

@MetaClass<FormModelMetadataArgs, FormModelMetadata>({
  single: true,
  allowOn: ['class'],
  proxy: {
    host: ModelMetadata,
    containerKey: 'form'
  }
})
export class FormModelMetadata extends BaseMetadata
  implements FormModelMetadataArgs {
  validator: ValidatorFn | null;
  asyncValidator: AsyncValidatorFn | null;
  props = new Map<string, FormPropMetadata>();

  constructor(metaArgs: FormModelMetadataArgs | undefined, info: DecoratorInfo) {
    super(info);

    if (isJsObject(metaArgs)) {
      this.validator = metaArgs.validator || null;
      this.asyncValidator = metaArgs.asyncValidator || null;
    }
  }

  addProp(prop: PropMetadata, metaArgs: FormPropMetadata) {
    this.props.set(prop.name as any, metaArgs);
  }

  getProp(propertyKey: string): FormPropMetadata | undefined {
    return this.props.get(propertyKey);
  }
}

declare module '@pebula/utils/meta/internal/lib/metadata/model-metadata' {
  interface ModelMetadataArgs {
    form?: FormModelMetadataArgs | undefined | true;
  }
}
