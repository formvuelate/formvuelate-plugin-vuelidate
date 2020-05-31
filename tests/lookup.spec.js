import LookupPlugin, { replaceProp } from '../src/index.js'

const schema = [
  {
    "model": "firstName",
    "type": "FormText",
    "label": "First Name"
  },
  {
    "label": "Favorite thing about Vue",
    "required": true,
    "model": "favoriteThingAboutVue",
    "type": "FormSelect"
  },
  {
    "label": "Are you a Vue fan?",
    "model": "isVueFan",
    "type": "FormCheckbox"
  }
]

const warn = jest.spyOn(console, 'warn').mockImplementation();

describe('Lookup Plugin', () => {
  beforeEach(() => jest.clearAllMocks())
  afterAll(() => warn.mockRestore())

  describe('componentProp', () => {
    it('replaces the component prop with the given one in config', () => {
      const lookup = LookupPlugin({ componentProp: 'type' })
      const { parsedSchema } = lookup({
        parsedSchema: schema
      })

      for (let el of parsedSchema) {
        expect('component' in el).toEqual(true)
        expect('type' in el).toEqual(false)
      }
    })

    it('throws a console warning if the component prop is not found', () => {
      const lookup = LookupPlugin({ componentProp: 'type' })
      lookup({
        parsedSchema: [
          {
            "model": "firstName",
            "other": "FormText",
            "label": "First Name"
          },
        ]
      })

      expect(warn).toHaveBeenCalledTimes(1)
    })
  })

  describe('mapComponents', () => {
    it('maps an key value object of components inside the schema', () => {
      const lookup = LookupPlugin({
        componentProp: 'type',
        mapComponents: {
          'FormText': 'BaseInput'
        }
      })
      const { parsedSchema } = lookup({ parsedSchema: schema })

      for (let el of parsedSchema) {
        expect(el.component).not.toEqual('FormText')
      }

      expect(parsedSchema[0].component).toEqual('BaseInput')
    })
  })

  describe('mapProps', () => {
    it('maps props in the schema elements from a key value pair object', () => {
      const lookup = LookupPlugin({
        componentProp: 'type',
        mapProps: {
          label: 'tag'
        }
      })
      const { parsedSchema } = lookup({ parsedSchema: schema })

      for (let el of parsedSchema) {
        expect('tag' in el).toEqual(true)
        expect('label' in el).toEqual(false)
      }
    })

    it('disables warnings for elements without a particular prop', () => {
      const lookup = LookupPlugin({
        componentProp: 'type',
        mapProps: {
          required: 'mandatory'
        }
      })
      const { parsedSchema } = lookup({ parsedSchema: schema })

      expect(warn).not.toHaveBeenCalled()
    })
  })

  describe('replaceProp function', () => {
    it('replaces a property within a schema', () => {
      const replacedSchema = replaceProp(
        schema,
        'label',
        'tag',
        { disableWarn: false }
      )

      for (let el of replacedSchema) {
        expect('tag' in el).toEqual(true)
        expect('label' in el).toEqual(false)
      }
    })
  })
})
