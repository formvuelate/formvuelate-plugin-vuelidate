import VuelidatePlugin from '../../src/index'

import { mount } from '@vue/test-utils'
import { ref } from 'vue'

describe('Vuelidate plugin', () => {
  it('remaps the elements in a Schema to Vuelidate validated components', () => {
    const schema = [
      [
        {
          model: 'first',
          component: 'FormText',
          validations: {
            required: () => { return true }
          }
        }
      ],
      [
        {
          model: 'second',
          component: 'FormText',
          validations: {
            email: () => { return true }
          }
        }
      ]
    ]

    const { parsedSchema } = VuelidatePlugin({
      parsedSchema: ref(schema)
    })

    parsedSchema.value[0].forEach(comp => {
      const wrapper = mount(parsedSchema.value[0][0].component)
      expect(wrapper.vm.vResults).toEqual(
        expect.objectContaining({ $dirty: false })
      )
    })
  })
})
