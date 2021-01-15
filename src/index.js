import { toRefs, h, computed, markRaw } from 'vue'
import useVuelidate from '@vuelidate/core'

/**
 * For a Schema, find the elements in each of the rows and remap the element with the given function
 * @param {Array} schema
 * @param {Function} fn
 *
 * @returns {Array}
 */
export const mapElementsInSchema = (schema, fn) => schema.map(row => row.map(el => fn(el)))

export default function VuelidatePlugin (baseReturns) {
  // Take the parsed schema from SchemaForm setup returns
  const { parsedSchema } = baseReturns

  // Wrap all components with the "withVuelidate" component
  const schemaWithVuelidate = computed(() => mapElementsInSchema(parsedSchema.value, el => {
    return {
      ...el,
      component: markRaw(withVuelidate(el.component))
    }
  }))

  return {
    ...baseReturns,
    parsedSchema: schemaWithVuelidate
  }
}

export function withVuelidate (Comp) {
  return {
    setup (props, { attrs }) {
      const { validations, modelValue, model } = toRefs(props)

      const propertyName = model ? model.value : attrs.model
      const validationsObj = validations || (attrs.validations ? attrs.validations : {})

      // Setup validation results for that schema leaf
      const vResults = useVuelidate(
        { [propertyName]: validationsObj },
        { [propertyName]: modelValue }
      )

      return {
        vResults,
        props,
        attrs
      }
    },
    render () {
      // It renders the original component with the
      // validation results as props
      return h(Comp, {
        ...this.props,
        ...this.attrs,
        vResults: this.vResults
      })
    }
  }
}
