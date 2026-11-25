# Sanity Uplift

The shared layer Moze puts on every Sanity Studio it builds: how the Studio reads (type, spacing, form hierarchy), the same in every project. It never touches content, structure, colours or copy.

## Language

### Uplift and its users

**Uplift**:
The layer every Moze project installs so its Studio reads the same way as the others. It holds only what every Moze Studio should share.
_Avoid_: Mozefy (old name), layer, the package

**Project**:
A client codebase that installs Uplift. It owns its schemas, structure, colours and copy.
_Avoid_: app, site, client

**Studio**:
The editing app of one project, built on Sanity Studio.
_Avoid_: CMS, admin, backend

**Editor**:
A person who writes content in a Studio, usually not a developer. Uplift is designed for them.
_Avoid_: user, client, author

### Tokens

**Token**:
A design value Uplift sets through the Studio theme, so that every part of the Studio that follows the theme picks it up.
_Avoid_: variable, setting

**Token group**:
A whole scale of tokens, replaced as one: the spacing scale or the type scale.
_Avoid_: token set

**Spacing scale**:
The ten steps of space the Studio lays out with, from none to the widest gap.
_Avoid_: spacing tokens, margins

**Type scale**:
The five steps of text size, each with its line height.
_Avoid_: font sizes, text tokens

**Step**:
One position on a scale, numbered from 0. A step keeps its meaning in every Studio; only its value changes.
_Avoid_: level, size

**Body text**:
The text size most of the Studio is written in: step 1 of the type scale.
_Avoid_: base size, default text

**Comfortable**:
The token values Uplift applies by default: larger type and roomier space than Sanity's, for editors. It is the only tuning there is.
_Avoid_: preset, density, theme

**Token bridge**:
What carries the theme's spacing and type scale to the parts of the Studio that ignore the theme, so the whole Studio follows one scale.
_Avoid_: shim, polyfill, sync

**Base theme**:
The theme a project hands to Uplift to start from, carrying the project's colours. Uplift changes only its spacing and type.
_Avoid_: project theme, colour theme

### Rules

**Rule**:
A style Uplift applies where no token reaches, such as the weight of a field title.
_Avoid_: override, patch, hack

**Rule set**:
A named group of rules a project can turn off as one: Form or Arrays.
_Avoid_: layer, module, feature

**Rule variable**:
A named value inside a rule that a project can retune without copying the rule.
_Avoid_: CSS variable, custom property, token

**Retune**:
To change a token group or a rule variable for one project while keeping Uplift's rules. The only customisation Uplift supports.
_Avoid_: override, customise

**Fork**:
To copy Uplift's rules into a project and change them there. Uplift exists so that no project has to.
_Avoid_: eject, vendor

### The Studio form

**Field**:
One input of a document, with its header and its value.
_Avoid_: input, property

**Field header**:
The top of a field: its title, its description and its status.
_Avoid_: label area

**Field title**:
The name of a field as an editor reads it; the strongest text of the field.
_Avoid_: label, legend, field name

**Field description**:
The help text under a field title.
_Avoid_: hint, subtitle, help text

**Fieldset**:
A group of fields a schema declares together, shown under one title and often collapsible. Not every group of fields inside another is a fieldset.
_Avoid_: section, field group

**Field group**:
A named subset of a document's fields, so an editor works on one subset at a time.
_Avoid_: fieldset, tab

**Group tab**:
The tab an editor uses to switch between field groups.
_Avoid_: tab (documents also have view tabs)

**Nested content**:
The fields inside an object, an array, an image, a file or a fieldset, shown under its title and set apart by a line and an indent.
_Avoid_: nested fieldset, child fields

**Nesting level**:
How deep nested content sits in a document. The document itself is level 0, so an object field placed straight on the document is already nested.
_Avoid_: depth, indent level

**Array item**:
One entry of an array, shown as its own card.
_Avoid_: row, element, block

**Page builder**:
An array whose items are the sections of a page, picked and ordered by the editor.
_Avoid_: modules, blocks, sections list
