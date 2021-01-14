import VuelidatePlugin from '../../src/index'

import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'

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

  it('preserves reactivty in computed schemas', () => {
    const toggle = ref('A')
    const computedSchema = computed(() => {
      return toggle.value === 'A'
        ? [
          [
            {
              model: 'first',
              component: 'FormText',
              validations: {
                required: () => { return true }
              }
            }
          ]
        ]
        : [
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
    })

    const { parsedSchema } = VuelidatePlugin({ parsedSchema: computedSchema })

    expect(parsedSchema.value).toEqual([[
      {
        component: expect.objectContaining({
          setup: expect.any(Function)
        }),
        model: 'first',
        validations: {
          required: expect.any(Function)
        }
      }
    ]])

    toggle.value = 'B'

    expect(parsedSchema.value).toEqual([[
      {
        component: expect.objectContaining({
          setup: expect.any(Function)
        }),
        model: 'second',
        validations: {
          email: expect.any(Function)
        }
      }
    ]])
  })
})
