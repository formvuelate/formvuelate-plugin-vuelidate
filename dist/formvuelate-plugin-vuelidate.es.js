/**
 * @formvuelate/plugin-vuelidate v1.0.0-alpha.4
 * (c) 2021 Damian Dulisz <damian.dulisz@gmail.com>, Marina Mosti <marina@mosti.com.mx>
 * @license MIT
 */

import { computed, h, markRaw, toRefs } from 'vue';
import useVuelidate from '@vuelidate/core';

/**
 * For a Schema, find the elements in each of the rows and remap the element with the given function
 * @param {Array} schema
 * @param {Function} fn
 *
 * @returns {Array}
 */
var mapElementsInSchema = function (schema, fn) { return schema.map(function (row) { return row.map(function (el) { return fn(el); }); }); };

function VuelidatePlugin (baseReturns) {
  // Take the parsed schema from SchemaForm setup returns
  var parsedSchema = baseReturns.parsedSchema;

  // Wrap all components with the "withVuelidate" component
  var schemaWithVuelidate = computed(function () { return mapElementsInSchema(parsedSchema.value, function (el) {
    return Object.assign({}, el,
      {component: markRaw(withVuelidate(el.component))})
  }); });

  return Object.assign({}, baseReturns,
    {parsedSchema: schemaWithVuelidate})
}

function withVuelidate (Comp) {
  return {
    setup: function setup (props, ref) {
      var obj, obj$1;

      var attrs = ref.attrs;
      var ref$1 = toRefs(props);
      var validations = ref$1.validations;
      var modelValue = ref$1.modelValue;
      var model = ref$1.model;

      var propertyName = model ? model.value : attrs.model;
      var validationsObj = validations || (attrs.validations ? attrs.validations : {});

      // Setup validation results for that schema leaf
      var vResults = useVuelidate(
        ( obj = {}, obj[propertyName] = validationsObj, obj),
        ( obj$1 = {}, obj$1[propertyName] = modelValue, obj$1)
      );

      return {
        vResults: vResults,
        props: props,
        attrs: attrs
      }
    },
    render: function render () {
      // It renders the original component with the
      // validation results as props
      return h(Comp, Object.assign({}, this.props,
        this.attrs,
        {vResults: this.vResults}))
    }
  }
}

export { mapElementsInSchema, withVuelidate };
export default VuelidatePlugin;
