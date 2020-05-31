# @formvuelatte/plugin-lookup

Lookup plugin for FormVueLatte

For documentation check out [FormVueLatte's docs](https://github.com/vuelidate/formvuelatte)

## Quick example

```html
<template>
  <div id="app">
    <SchemaFormWithPlugin
      :schema="schema"
      v-model="formData"
    />

    <pre>{{ formData }}</pre>
  </div>
</template>

<script>
import { SchemaFormFactory } from 'formvuelatte'
import LookupPlugin from '@/plugins/LookupPlugin'

import SCHEMA from 'some/schema.json'

const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    componentProp: 'type',
    mapComponents: {
      string: 'FormText',
      array: 'FormSelect',
      boolean: 'FormCheckbox',
      SchemaForm: 'SchemaFormWithPlugin'
    },
    mapProps: {
      info: 'label'
    }
  })
])

export default {
  name: 'App',
  components: {
    SchemaFormWithPlugin
  },
  setup () {
    const formData = ref({})

    return {
      schema: SCHEMA,
      formData
    }
  }
}
</script>
```
