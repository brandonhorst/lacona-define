/** @jsx createElement */

import _ from 'lodash'
import { createElement } from 'elliptical'
import { openURL, fetchDictionaryDefinitions } from 'lacona-api'

import { Command } from 'lacona-phrases'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { startWith } from 'rxjs/operator/startWith'

const DefinitionSource = {
  fetch ({props}) {
    return fromPromise(fetchDictionaryDefinitions({word: props.word}))::startWith([])
  },
  clear: true
}

function hasDefinition(input, observe) {
  const data = observe(<DefinitionSource word={input} />)
  return !!data.length
}

const Define = {
  extends: [Command],
  execute (result) {
    openURL({url: `dict://${result.item}`})
  },
  preview (result) {
    const data = observe(<DefinitionSource word={result.item} />)
    if (data.length) {
      const allHTML = _.map(data, 'html').join('<hr />')
      return {type: 'html', value: allHTML}
    }
  },
  describe ({observe}) {
    return (
      <sequence>
        <list items={['define ', 'look up ']} />
        <String label='word or phrase' id='item' consumeAll filter={input => hasDefinition(input, observe)} />
      </sequence>
    )
  }
}

export default [Define]
