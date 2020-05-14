/**
 *  Copyright (c) 2019 GraphQL Contributors
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
import { getNamedType } from 'graphql';
export function getFieldReference(typeInfo) {
  return {
    kind: 'Field',
    schema: typeInfo.schema,
    field: typeInfo.fieldDef,
    type: isMetaField(typeInfo.fieldDef) ? null : typeInfo.parentType
  };
}
export function getDirectiveReference(typeInfo) {
  return {
    kind: 'Directive',
    schema: typeInfo.schema,
    directive: typeInfo.directiveDef
  };
}
export function getArgumentReference(typeInfo) {
  return typeInfo.directiveDef ? {
    kind: 'Argument',
    schema: typeInfo.schema,
    argument: typeInfo.argDef,
    directive: typeInfo.directiveDef
  } : {
    kind: 'Argument',
    schema: typeInfo.schema,
    argument: typeInfo.argDef,
    field: typeInfo.fieldDef,
    type: isMetaField(typeInfo.fieldDef) ? null : typeInfo.parentType
  };
}
export function getEnumValueReference(typeInfo) {
  return {
    kind: 'EnumValue',
    value: typeInfo.enumValue,
    // $FlowFixMe
    type: getNamedType(typeInfo.inputType)
  };
} // Note: for reusability, getTypeReference can produce a reference to any type,
// though it defaults to the current type.

export function getTypeReference(typeInfo, type) {
  return {
    kind: 'Type',
    schema: typeInfo.schema,
    type: type || typeInfo.type
  };
}

function isMetaField(fieldDef) {
  return fieldDef.name.slice(0, 2) === '__';
}