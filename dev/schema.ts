import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Generic fixtures that cover the parts of the form Uplift styles: field titles
 * and descriptions, nested objects and fieldsets, groups, arrays in list and grid
 * layout, Portable Text, images, references and validation messages.
 * Placeholder content only: nothing here models a real project.
 */

const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      description: 'An absolute URL, starting with https://.',
    }),
  ],
})

const card = defineType({
  name: 'card',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'link', title: 'Link', type: 'link'}),
  ],
  preview: {select: {title: 'title', subtitle: 'body', media: 'image'}},
})

const fixture = defineType({
  name: 'fixture',
  title: 'Fixture',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'nesting', title: 'Nesting'},
    {name: 'arrays', title: 'Arrays'},
  ],
  fieldsets: [
    {name: 'meta', title: 'Meta', description: 'A fieldset, collapsible.', options: {collapsible: true}},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'A short description under the title, to check the hierarchy between the two.',
      validation: (rule) => rule.required().max(60).warning('Keep it under 60 characters.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title'},
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'A longer description that wraps onto a second line, to check the measure and the line height of descriptions next to their field.',
    }),
    defineField({name: 'published', title: 'Published', type: 'boolean', group: 'content'}),
    defineField({name: 'date', title: 'Date', type: 'datetime', group: 'content'}),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      group: 'content',
      options: {list: ['One', 'Two', 'Three'], layout: 'radio', direction: 'horizontal'},
    }),
    defineField({name: 'cover', title: 'Cover', type: 'image', group: 'content', options: {hotspot: true}}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'block'}), defineArrayMember({type: 'image'})],
    }),
    defineField({name: 'author', title: 'Author', type: 'string', fieldset: 'meta'}),
    defineField({name: 'tags', title: 'Tags', type: 'array', fieldset: 'meta', of: [{type: 'string'}], options: {layout: 'tags'}}),
    defineField({
      name: 'related',
      title: 'Related',
      type: 'reference',
      group: 'content',
      to: [{type: 'fixture'}],
    }),
    defineField({
      name: 'outer',
      title: 'Outer object',
      type: 'object',
      group: 'nesting',
      description: 'Three levels deep, to check the room and indentation at each level.',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({
          name: 'middle',
          title: 'Middle object',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({
              name: 'inner',
              title: 'Inner object',
              type: 'object',
              options: {collapsible: true, collapsed: false},
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'note', title: 'Note', type: 'text', rows: 2}),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({name: 'link', title: 'Link', type: 'link', group: 'nesting'}),
    defineField({
      name: 'cards',
      title: 'Cards (list)',
      type: 'array',
      group: 'arrays',
      description: 'An array of objects in the default list layout.',
      of: [defineArrayMember({type: 'card'})],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery (grid)',
      type: 'array',
      group: 'arrays',
      description: 'An array in grid layout.',
      options: {layout: 'grid'},
      of: [defineArrayMember({type: 'image'})],
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      group: 'arrays',
      of: [defineArrayMember({type: 'link'})],
    }),
  ],
})

export const schemaTypes = [link, card, fixture]
