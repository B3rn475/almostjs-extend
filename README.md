# almostjs-extend
__ALMOsT__ is an **A**gi**L**e **MO**del **T**ransformation framework for JavaScript

[![NPM Version][npm-image]][npm-url]
[![MIT licensed][license-image]][license-url]

This repository contains the model extender module.
For a whole set of helpers see the whole project [ALMOsT](https://github.com/B3rn475/almostjs)

This module gives you a set of tools to easily enreach your models with a set of helpers that make rules implementation faster.

## Installation

```bash
$ npm install almost-extend
```

## The Model

__ALMOsT__ does not make any assumption on the structure of your your elements or relations between elements.
The only assumption is made on the structure of the input model.

It must be an __Object__ with at least two properties __elements__ and __relations__ which are **Array**s.

```javascript
  {
    "elements": [],
    "relations": []
  }
```

__almostjs-extend__ though makes some more assumptions.

The model itself remains the same, but you are not allowed to add other attributes to it, except to __metadata__.

```javascript
  {
    "elements": [], // mandatory
    "relations": [] // mandatory
    "metadata": {} // optional
  }
```

## Elements

In __almostjs-extend__ elements must be structured as follow.

Elements must be **Object**s with the following attributes:
 - __id__ a __String__ uniquely identifing the element
 - __type__ a __String__ identifing the type of the element
 - __attributes__ an __Object__ containing the attributes of the element (the internal structure is not fixed by this module)
 - __metadata__ [Optional] an __Object__ containing data not necessary to describe the element, but useful to enreach its description. (They shouldn't be used inside the rule __Activation Expression__)
 
## Relations

In __almostjs-extend__ relations must be structured as follow.

Relations must be **Object**s with the following attributes:
 - __type__ a __String__ identifing the type of relation
 - all the other attributes must be **String**s identifying one element in the __elements__ array

## Configuration

With __almostjs-extend__ you can create and __Extender__ a function which takes as input a valid model and generates and enreached version of it, based on a set of configurations.

```javascript
  var createExtender = require('almost-extend').createExtender;
  
  var extend = createExtender({
    type: {},
    relation: {}
    custom: {}
  });
  
  var extended_model1 = extend(model1);
  var extended_model2 = extend(model2);
  // ...
  var extended_modelN = extend(modelN);
```

### Helpers

The extended model will preserve the same **elements**, __relations__ and __metadata__ attributes of the original model.

It will have a set of helpers:
 - __toElement(element | id)__ an helper which maps an id to its element (if an element is passed it will returned as it is)
 - __toId(element | id)__ an helper which maps an element to its id (if an id is passed it will returned as it is)
 - __is\[Type\](element | id, [default])__ a configurable set of helpers which facilitate type identification (if a __default__ value is provided it will be returned in case the element or the id does not exists)
 - __get\[Relative\](element | id, [default])__ a configurable set of helpers which facilitate relation navigation (if a __default__ value is provided it will be returned in case the element, the id or the relatives does not exist)
 - __custom(...)__ a configurable set of custom helpers which can be used for custom checks or graph navigations

#### Type Checking

__isType__ helpers are generates starting from the __type__ attribute of the configuration object.

The __type__ configuration must be and __Object__ where each attribute can be a __String__ or and __Array__ of **String**s.

```javascript
  {
    "Foo": "my.identifier.for.foo",
    "Bar": "my.identifier.for.bar",
    "Both": ["my.identifier.for.foo", "my.identifier.for.foo"]
  }
```

This configuration will generate the helpers:
 - __isFoo__ which checks if an element (or the element related to an id) is has __type__ "my.identifier.for.foo"
 - __isBar__ which checks if an element (or the element related to an id) is has __type__ "my.identifier.for.bar"
 - __isBoth__ which checks if an element (or the element related to an id) is has __type__ "my.identifier.for.foo" or "my.identifier.for.bar"
 
#### Graph Navigation

__getRelative__ helpers are generates starting from the __relation__ attribute of the configuration object.

The __relation__ configuration must be and __Object__ where each attribute is an __Object__ with the following attributes:
 - __relation__ the type of the relation to navigate
 - __from__ the name of the reference in the relation objects where is stored the id sorce of this navigation
 - __to__ the name of the reference in the relation objects where is stored the id target of this navigation
 - __single__ [optional] if set to true the helper is configured for single lookup.

```javascript
  {
    "Parent": {relation: "hierarchy", from: "child", to: "parent", single: true},
    "Children": {relation: "hierarchy", from: "parent", to: "child"}
  }
```

This configuration will generate the helpers:
 - __getParent__ which returns the parent of an element (accepts an element or an id as input)
 - __getParentId__ which returns the id of the parent of an element (accepts an element or an id as input)
 - __getChildren__ which returns an __Array__ containing the ids of the children of an element (accepts an element or an id as input)
 
#### Custom Helpers

__custom__ helpers are generated starting from the __custom__ attribute of the configuration object.

The __relation__ configuration must be and __Object__ where each attribute is a __Function__ which will be attached to the model object. Inside this helpers the __this__ will always refer to the model.

[npm-image]: https://img.shields.io/npm/v/almost-extend.svg
[npm-url]: https://npmjs.org/package/almost-extend
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/B3rn475/almostjs-extend/master/LICENSE
